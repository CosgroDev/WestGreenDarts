import { NextRequest, NextResponse } from 'next/server'
import { getAllPlayers, deletePlayerStatistics, upsertPlayerStatistics } from '@/lib/db-direct'
import { calculatePlayerAllTimeStatistics } from '@/lib/statistics-calculator'

// POST recalculate all player statistics
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const playerId = searchParams.get('playerId')

    if (playerId) {
      // Recalculate for specific player
      const stats = await calculatePlayerAllTimeStatistics(playerId)

      // Delete existing all-time stats and recreate
      deletePlayerStatistics(playerId, null)

      upsertPlayerStatistics({
        playerId,
        seasonId: null,
        ...stats,
      })

      return NextResponse.json({
        success: true,
        message: `Recalculated statistics for player ${playerId}`,
      })
    } else {
      // Recalculate for all players
      const players = getAllPlayers()

      for (const player of players) {
        const stats = await calculatePlayerAllTimeStatistics(player.id)

        deletePlayerStatistics(player.id, null)

        if (stats.totalGames > 0) {
          upsertPlayerStatistics({
            playerId: player.id,
            seasonId: null,
            ...stats,
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: `Recalculated statistics for ${players.length} players`,
      })
    }
  } catch (error) {
    console.error('Error recalculating statistics:', error)
    return NextResponse.json(
      { error: 'Failed to recalculate statistics' },
      { status: 500 }
    )
  }
}
