import { NextRequest, NextResponse } from 'next/server'
import { getPlayerStatistics } from '@/lib/db-direct'

// GET player statistics
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    // Fetch statistics
    const stats = getPlayerStatistics(params.id, seasonId || null)

    if (!stats) {
      // Return empty statistics if none found
      return NextResponse.json({
        playerId: params.id,
        seasonId: seasonId || null,
        totalLegs: 0,
        legsWon: 0,
        totalGames: 0,
        gamesWon: 0,
        threeDartAverage: 0,
        firstNineAverage: 0,
        scores60Plus: 0,
        scores80Plus: 0,
        scores100Plus: 0,
        scores120Plus: 0,
        scores140Plus: 0,
        scores170Plus: 0,
        total180s: 0,
        highFinish: 0,
        finishes100Plus: 0,
        bestLeg: null,
        worstLeg: null,
        checkoutPercentage: 0,
        checkoutPrediction: 0,
        keepPercentage: 0,
        keepPrediction: 0,
        breakPercentage: 0,
        breakPrediction: 0,
      })
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching player statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
