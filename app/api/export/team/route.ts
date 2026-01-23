import { NextRequest, NextResponse } from 'next/server'
import { getPlayerStatisticsWithRelations } from '@/lib/db-direct'
import { generateCSV, playerStatsColumns } from '@/lib/csv-generator'

// GET export team statistics (all players) as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    // Fetch all active player statistics
    const playerStats = getPlayerStatisticsWithRelations({
      seasonId: seasonId || null,
      activePlayersOnly: true,
    })

    // Transform data for CSV export
    const exportData = playerStats.map((stat) => ({
      playerName: stat.player.name,
      totalGames: stat.totalGames,
      gamesWon: stat.gamesWon,
      winPercentage: stat.totalGames > 0 ? (stat.gamesWon / stat.totalGames) * 100 : 0,
      totalLegs: stat.totalLegs,
      legsWon: stat.legsWon,
      legWinPercentage: stat.totalLegs > 0 ? (stat.legsWon / stat.totalLegs) * 100 : 0,
      threeDartAverage: stat.threeDartAverage,
      firstNineAverage: stat.firstNineAverage,
      totalVisits: stat.totalVisits,
      scores60Plus: stat.scores60Plus,
      scores80Plus: stat.scores80Plus,
      scores100Plus: stat.scores100Plus,
      scores120Plus: stat.scores120Plus,
      scores140Plus: stat.scores140Plus,
      scores170Plus: stat.scores170Plus,
      total180s: stat.total180s,
      highFinish: stat.highFinish,
      finishes100Plus: stat.finishes100Plus,
      bestLeg: stat.bestLeg,
      worstLeg: stat.worstLeg,
      checkoutAttempts: stat.checkoutAttempts,
      successfulCheckouts: stat.successfulCheckouts,
      checkoutPercentage: stat.checkoutPercentage,
      legsStarted: stat.legsStarted,
      legsWonWhenStarted: stat.legsWonWhenStarted,
      keepPercentage: stat.keepPercentage,
      legsNotStarted: stat.legsNotStarted,
      legsWonWhenNotStarted: stat.legsWonWhenNotStarted,
      breakPercentage: stat.breakPercentage,
    }))

    // Generate CSV
    const csv = generateCSV(exportData, playerStatsColumns)

    // Determine filename
    let filename = 'team-statistics'
    if (seasonId && playerStats.length > 0) {
      const season = playerStats[0]?.season?.name
      filename = `team-statistics-${season}`
    } else {
      filename = 'team-statistics-all-time'
    }
    filename += '.csv'

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error exporting team statistics:', error)
    return NextResponse.json(
      { error: 'Failed to export team statistics' },
      { status: 500 }
    )
  }
}
