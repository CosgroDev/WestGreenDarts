import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
      await prisma.playerStatistics.deleteMany({
        where: {
          playerId,
          seasonId: null,
        },
      })

      await prisma.playerStatistics.create({
        data: {
          playerId,
          seasonId: null,
          ...stats,
        },
      })

      return NextResponse.json({
        success: true,
        message: `Recalculated statistics for player ${playerId}`,
      })
    } else {
      // Recalculate for all players
      const players = await prisma.player.findMany()

      for (const player of players) {
        const stats = await calculatePlayerAllTimeStatistics(player.id)

        await prisma.playerStatistics.deleteMany({
          where: {
            playerId: player.id,
            seasonId: null,
          },
        })

        if (stats.totalGames > 0) {
          await prisma.playerStatistics.create({
            data: {
              playerId: player.id,
              seasonId: null,
              ...stats,
            },
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
