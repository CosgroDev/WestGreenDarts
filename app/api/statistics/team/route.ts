import { NextRequest, NextResponse } from 'next/server'
import {
  getPlayerStatisticsWithRelations,
  getCurrentSeason,
  countActivePlayers,
  countFixtures,
  countFixturesWithCompletedGames,
  getCompletedGamesForExport,
  getUpcomingFixtures,
} from '@/lib/db-direct'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    // Fetch all player statistics
    const playerStats = getPlayerStatisticsWithRelations({
      seasonId: seasonId || null,
      activePlayersOnly: true,
    })

    // Get current season
    const currentSeason = getCurrentSeason()

    // Count players
    const totalPlayers = countActivePlayers()

    // Count fixtures
    const totalFixtures = countFixtures(seasonId || undefined)
    const fixturesCompleted = countFixturesWithCompletedGames(seasonId || undefined)

    // Fetch recent games
    const recentGames = getCompletedGamesForExport({
      seasonId: seasonId || undefined,
    }).slice(0, 10)

    // Fetch upcoming fixtures
    const upcomingFixtures = getUpcomingFixtures(seasonId || undefined, 5)

    // Aggregate team statistics
    const teamStats = {
      totalPlayers,
      activePlayers: totalPlayers,
      totalGames: playerStats.reduce((sum, p) => sum + p.totalGames, 0),
      gamesWon: playerStats.reduce((sum, p) => sum + p.gamesWon, 0),
      totalLegs: playerStats.reduce((sum, p) => sum + p.totalLegs, 0),
      legsWon: playerStats.reduce((sum, p) => sum + p.legsWon, 0),
      totalFixtures,
      fixturesCompleted,
      currentSeason,

      // Team averages
      teamAverage:
        playerStats.length > 0
          ? parseFloat(
              (
                playerStats.reduce((sum, p) => sum + p.threeDartAverage, 0) /
                playerStats.length
              ).toFixed(2)
            )
          : 0,

      // Aggregate stats
      aggregateStats: {
        total180s: playerStats.reduce((sum, p) => sum + p.total180s, 0),
        scores100Plus: playerStats.reduce((sum, p) => sum + p.scores100Plus, 0),
        scores140Plus: playerStats.reduce((sum, p) => sum + p.scores140Plus, 0),
        highFinish: Math.max(...playerStats.map((p) => p.highFinish), 0),
        totalCheckouts: playerStats.reduce((sum, p) => sum + p.successfulCheckouts, 0),
        checkoutPercentage:
          playerStats.length > 0
            ? parseFloat(
                (
                  playerStats.reduce((sum, p) => sum + p.checkoutPercentage, 0) /
                  playerStats.length
                ).toFixed(2)
              )
            : 0,
      },

      // Top performers (top 5 in each category)
      topPerformers: {
        highestAverage: playerStats
          .filter((p) => p.totalGames > 0)
          .sort((a, b) => b.threeDartAverage - a.threeDartAverage)
          .slice(0, 5)
          .map((p) => ({
            playerId: p.playerId,
            playerName: p.player.name,
            value: p.threeDartAverage,
          })),

        most180s: playerStats
          .filter((p) => p.total180s > 0)
          .sort((a, b) => b.total180s - a.total180s)
          .slice(0, 5)
          .map((p) => ({
            playerId: p.playerId,
            playerName: p.player.name,
            value: p.total180s,
          })),

        highestCheckout: playerStats
          .filter((p) => p.highFinish > 0)
          .sort((a, b) => b.highFinish - a.highFinish)
          .slice(0, 5)
          .map((p) => ({
            playerId: p.playerId,
            playerName: p.player.name,
            value: p.highFinish,
          })),

        bestCheckoutPercentage: playerStats
          .filter((p) => p.checkoutAttempts >= 5) // Min 5 attempts
          .sort((a, b) => b.checkoutPercentage - a.checkoutPercentage)
          .slice(0, 5)
          .map((p) => ({
            playerId: p.playerId,
            playerName: p.player.name,
            value: p.checkoutPercentage,
          })),

        mostGames: playerStats
          .filter((p) => p.totalGames > 0)
          .sort((a, b) => b.totalGames - a.totalGames)
          .slice(0, 5)
          .map((p) => ({
            playerId: p.playerId,
            playerName: p.player.name,
            value: p.totalGames,
          })),
      },

      // Recent games
      recentGames: recentGames.map((game) => {
        const legsWon = game.legs.filter((leg) => leg.playerWon === true).length
        const legsLost = game.legs.filter((leg) => leg.playerWon === false).length

        return {
          id: game.id,
          playerName: game.player.name,
          opponentName: game.opponentName,
          result: game.playerWon === true ? 'won' : game.playerWon === false ? 'lost' : 'draw',
          score: `${legsWon}-${legsLost}`,
          date: game.completedAt || game.createdAt,
          fixtureId: game.fixtureId,
        }
      }),

      // Upcoming fixtures
      upcomingFixtures: upcomingFixtures.map((fixture) => ({
        id: fixture.id,
        opponentTeam: fixture.opponentTeam,
        date: fixture.date,
        isHome: fixture.isHome,
        venue: fixture.venue,
      })),
    }

    // Calculate games drawn (where playerWon is null)
    const gamesDraw =
      teamStats.totalGames - teamStats.gamesWon - (teamStats.totalLegs - teamStats.legsWon)

    return NextResponse.json({
      ...teamStats,
      gamesDraw,
      gamesLost: teamStats.totalGames - teamStats.gamesWon - gamesDraw,
    })
  } catch (error) {
    console.error('Error fetching team statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team statistics' },
      { status: 500 }
    )
  }
}
