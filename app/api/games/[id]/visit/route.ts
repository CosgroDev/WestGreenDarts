import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST record a visit (3 darts)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { legId, isPlayer, dart1, dart2, dart3 } = body

    if (!legId) {
      return NextResponse.json(
        { error: 'Leg ID is required' },
        { status: 400 }
      )
    }

    // Get the current leg
    const leg = await prisma.leg.findUnique({
      where: { id: legId },
      include: {
        visits: {
          orderBy: { visitNumber: 'desc' },
          take: 1,
        },
        game: {
          include: {
            legs: true,
          },
        },
      },
    })

    if (!leg) {
      return NextResponse.json(
        { error: 'Leg not found' },
        { status: 404 }
      )
    }

    if (leg.playerWon !== null) {
      return NextResponse.json(
        { error: 'Leg is already complete' },
        { status: 400 }
      )
    }

    // Calculate total score
    const totalScore = (dart1 || 0) + (dart2 || 0) + (dart3 || 0)

    // Get next visit number
    const nextVisitNumber = leg.visits.length > 0 ? leg.visits[0].visitNumber + 1 : 1

    // Calculate new remaining score
    const currentScore = isPlayer ? leg.playerScore : leg.opponentScore
    const newScore = currentScore - totalScore

    // Check for bust (went below 0 or landed on 1)
    const isBust = newScore < 0 || newScore === 1

    // Check for valid checkout (exactly 0 with last dart being a double)
    // For now, we'll simplify and just check if newScore is 0
    const isCheckout = newScore === 0 && !isBust

    // Create the visit
    const visit = await prisma.visit.create({
      data: {
        legId,
        visitNumber: nextVisitNumber,
        isPlayer,
        dart1,
        dart2,
        dart3,
        totalScore,
        isCheckout,
        checkoutScore: isCheckout ? currentScore : null,
      },
    })

    // Update leg score if not bust
    if (!isBust) {
      if (isPlayer) {
        await prisma.leg.update({
          where: { id: legId },
          data: {
            playerScore: newScore,
            totalDarts: { increment: 3 },
          },
        })
      } else {
        await prisma.leg.update({
          where: { id: legId },
          data: {
            opponentScore: newScore,
          },
        })
      }
    }

    // Check if leg is won
    if (isCheckout) {
      await prisma.leg.update({
        where: { id: legId },
        data: {
          playerWon: isPlayer,
          completedAt: new Date(),
        },
      })

      // Check if game is complete (Best of 2)
      const game = leg.game
      const completedLegs = game.legs.filter((l) => l.playerWon !== null || l.id === legId)
      const playerWins = completedLegs.filter((l) =>
        l.id === legId ? isPlayer : l.playerWon === true
      ).length

      // Game ends when:
      // - Player wins 2 legs (2-0)
      // - Opponent wins 2 legs (0-2)
      // - Both legs complete and it's 1-1 (draw)
      if (playerWins === 2) {
        // Player won 2-0 or 2-1
        await prisma.game.update({
          where: { id: game.id },
          data: {
            isComplete: true,
            playerWon: true,
            completedAt: new Date(),
          },
        })
      } else if (completedLegs.length - playerWins === 2) {
        // Opponent won 2-0 or 2-1
        await prisma.game.update({
          where: { id: game.id },
          data: {
            isComplete: true,
            playerWon: false,
            completedAt: new Date(),
          },
        })
      } else if (completedLegs.length === 2) {
        // Both legs complete, must be 1-1 draw
        await prisma.game.update({
          where: { id: game.id },
          data: {
            isComplete: true,
            playerWon: null, // null indicates draw
            completedAt: new Date(),
          },
        })
      } else if (game.legs.length === 1 && completedLegs.length === 1) {
        // First leg complete, create second leg
        // Alternate who starts
        const secondLegStarter = !leg.playerStarted
        await prisma.leg.create({
          data: {
            gameId: game.id,
            legNumber: 2,
            playerScore: 501,
            opponentScore: 501,
            playerStarted: secondLegStarter,
          },
        })
      }
    }

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
    console.error('Error recording visit:', error)
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    )
  }
}
