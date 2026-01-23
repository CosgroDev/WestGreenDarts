import { NextRequest, NextResponse } from 'next/server'
import {
  getLegById,
  getLegsForGame,
  createVisit,
  updateLeg,
  updateGame,
  createLeg,
  getGameWithFullDetails,
} from '@/lib/db-direct'
import { updatePlayerStatistics } from '@/lib/statistics-calculator'

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

    // Get the current leg with visits
    const leg = getLegById(legId)

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
    const nextVisitNumber = leg.visits.length > 0
      ? Math.max(...leg.visits.map(v => v.visitNumber)) + 1
      : 1

    // Calculate new remaining score
    const currentScore = isPlayer ? leg.playerScore : leg.opponentScore
    const newScore = currentScore - totalScore

    // Check for bust (went below 0 or landed on 1)
    const isBust = newScore < 0 || newScore === 1

    // Check for valid checkout (exactly 0)
    const isCheckout = newScore === 0 && !isBust

    // Create the visit
    createVisit({
      legId,
      visitNumber: nextVisitNumber,
      isPlayer,
      dart1,
      dart2,
      dart3,
      totalScore,
      isCheckout,
      checkoutScore: isCheckout ? currentScore : undefined,
    })

    // Update leg score if not bust
    if (!isBust) {
      if (isPlayer) {
        updateLeg(legId, {
          playerScore: newScore,
          totalDarts: leg.totalDarts + 3,
        })
      } else {
        updateLeg(legId, {
          opponentScore: newScore,
        })
      }
    }

    // Check if leg is won
    if (isCheckout) {
      const now = new Date().toISOString()
      updateLeg(legId, {
        playerWon: isPlayer,
        completedAt: now,
      })

      // Get all legs for the game to check if game is complete
      const allLegs = getLegsForGame(leg.gameId)
      const completedLegs = allLegs.filter(l =>
        l.playerWon !== null || l.id === legId
      )
      const playerWins = completedLegs.filter(l =>
        l.id === legId ? isPlayer : l.playerWon === true
      ).length

      // Game ends when:
      // - Player wins 2 legs (2-0)
      // - Opponent wins 2 legs (0-2)
      // - Both legs complete and it's 1-1 (draw)
      if (playerWins === 2) {
        // Player won 2-0 or 2-1
        updateGame(leg.gameId, {
          isComplete: true,
          playerWon: true,
          completedAt: now,
        })
        // Update player statistics
        await updatePlayerStatistics(leg.gameId)
      } else if (completedLegs.length - playerWins === 2) {
        // Opponent won 2-0 or 2-1
        updateGame(leg.gameId, {
          isComplete: true,
          playerWon: false,
          completedAt: now,
        })
        // Update player statistics
        await updatePlayerStatistics(leg.gameId)
      } else if (completedLegs.length === 2) {
        // Both legs complete, must be 1-1 draw
        updateGame(leg.gameId, {
          isComplete: true,
          playerWon: null,
          completedAt: now,
        })
        // Update player statistics
        await updatePlayerStatistics(leg.gameId)
      } else if (allLegs.length === 1 && completedLegs.length === 1) {
        // First leg complete, create second leg
        // Alternate who starts
        const secondLegStarter = !leg.playerStarted
        createLeg({
          gameId: leg.gameId,
          legNumber: 2,
          playerStarted: secondLegStarter,
        })
      }
    }

    // Return updated game state
    const updatedGame = getGameWithFullDetails(params.id)

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error('Error recording visit:', error)
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    )
  }
}
