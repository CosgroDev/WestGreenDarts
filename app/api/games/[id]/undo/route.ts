import { NextRequest, NextResponse } from 'next/server'
import {
  getGameWithFullDetails,
  updateLeg,
  updateGame,
  deleteLeg,
  deleteVisit,
} from '@/lib/db-direct'

// POST undo last visit
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the game with all legs and visits
    const game = getGameWithFullDetails(params.id)

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      )
    }

    // Find the last visit across all legs (reverse order)
    let lastVisit = null
    let legWithLastVisit = null

    const legsReversed = [...game.legs].reverse()
    for (const leg of legsReversed) {
      if (leg.visits.length > 0) {
        const visitsReversed = [...leg.visits].reverse()
        lastVisit = visitsReversed[0]
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
      updateLeg(legWithLastVisit.id, {
        playerWon: null,
        completedAt: null,
      })

      // If game was completed, reopen it
      if (game.isComplete) {
        updateGame(game.id, {
          isComplete: false,
          playerWon: null,
          completedAt: null,
        })
      }

      // If this was leg 2 and was just created after leg 1 completed, delete leg 2
      // Check if it has only the one visit we're about to delete
      if (legWithLastVisit.legNumber === 2 && legWithLastVisit.visits.length === 1) {
        deleteLeg(legWithLastVisit.id)
      }
    }

    // Restore the score before this visit (only if it wasn't a bust)
    const currentScore = lastVisit.isPlayer
      ? legWithLastVisit.playerScore
      : legWithLastVisit.opponentScore

    // Calculate original score (current + totalScore since we subtracted it)
    const originalScore = currentScore + lastVisit.totalScore

    // Check if this was a bust (score didn't change)
    // If it was a bust, the score would still be at the same value
    const wasBust = currentScore === originalScore

    if (!wasBust) {
      if (lastVisit.isPlayer) {
        updateLeg(legWithLastVisit.id, {
          playerScore: originalScore,
          totalDarts: legWithLastVisit.totalDarts - 3,
        })
      } else {
        updateLeg(legWithLastVisit.id, {
          opponentScore: originalScore,
        })
      }
    }

    // Delete the visit
    deleteVisit(lastVisit.id)

    // Return updated game state
    const updatedGame = getGameWithFullDetails(params.id)

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error('Error undoing visit:', error)
    return NextResponse.json(
      { error: 'Failed to undo visit' },
      { status: 500 }
    )
  }
}
