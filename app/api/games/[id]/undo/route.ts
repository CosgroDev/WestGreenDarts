import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST undo last visit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the game with all legs and visits
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      include: {
        legs: {
          orderBy: { legNumber: 'desc' },
          include: {
            visits: {
              orderBy: { visitNumber: 'desc' },
            },
          },
        },
      },
    })

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Find the last visit across all legs
    let lastVisit = null
    let legWithLastVisit = null

    for (const leg of game.legs) {
      if (leg.visits.length > 0) {
        lastVisit = leg.visits[0]
        legWithLastVisit = leg
        break
      }
    }

    if (!lastVisit || !legWithLastVisit) {
      return NextResponse.json(
        { error: 'No visits to undo' },
        { status: 400 }
      )
    }

    // If the leg was completed by this visit, reopen it
    if (lastVisit.isCheckout && legWithLastVisit.playerWon !== null) {
      await prisma.leg.update({
        where: { id: legWithLastVisit.id },
        data: {
          playerWon: null,
          completedAt: null,
        },
      })

      // If game was completed, reopen it
      if (game.isComplete) {
        await prisma.game.update({
          where: { id: game.id },
          data: {
            isComplete: false,
            playerWon: null,
            completedAt: null,
          },
        })
      }

      // If this was leg 2 and was just created after leg 1 completed, delete leg 2
      if (legWithLastVisit.legNumber === 2 && legWithLastVisit.visits.length === 0) {
        await prisma.leg.delete({
          where: { id: legWithLastVisit.id },
        })
      }
    }

    // Restore the score before this visit (only if it wasn't a bust)
    const currentScore = lastVisit.isPlayer
      ? legWithLastVisit.playerScore
      : legWithLastVisit.opponentScore

    // Calculate original score (current + totalScore since we subtracted it)
    const originalScore = currentScore + lastVisit.totalScore

    // Check if this was a bust (score didn't change)
    const wasBust = currentScore === (lastVisit.isPlayer ? 501 : legWithLastVisit.opponentScore)

    if (!wasBust) {
      if (lastVisit.isPlayer) {
        await prisma.leg.update({
          where: { id: legWithLastVisit.id },
          data: {
            playerScore: originalScore,
            totalDarts: { decrement: 3 },
          },
        })
      } else {
        await prisma.leg.update({
          where: { id: legWithLastVisit.id },
          data: {
            opponentScore: originalScore,
          },
        })
      }
    }

    // Delete the visit
    await prisma.visit.delete({
      where: { id: lastVisit.id },
    })

    // Return updated game state
    const updatedGame = await prisma.game.findUnique({
      where: { id: params.id },
      include: {
        player: true,
        legs: {
          orderBy: { legNumber: 'asc' },
          include: {
            visits: {
              orderBy: { visitNumber: 'asc' },
            },
          },
        },
      },
    })

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error('Error undoing visit:', error)
    return NextResponse.json(
      { error: 'Failed to undo visit' },
      { status: 500 }
    )
  }
}
