import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCSV, gameDataColumns } from '@/lib/csv-generator'

// GET export game data as CSV
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')
    const playerId = searchParams.get('playerId')
    const fixtureId = searchParams.get('fixtureId')

    // Build where clause
    const where: any = {
      isComplete: true,
    }

    if (playerId) {
      where.playerId = playerId
    }

    if (fixtureId) {
      where.fixtureId = fixtureId
    } else if (seasonId) {
      where.fixture = {
        seasonId,
      }
    }

    // Fetch completed games
    const games = await prisma.game.findMany({
      where,
      include: {
        player: true,
        fixture: {
          include: {
            season: true,
          },
        },
        legs: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    // Transform data for CSV export
    const exportData = games.map((game) => {
      const legsWon = game.legs.filter((leg) => leg.playerWon === true).length
      const legsLost = game.legs.filter((leg) => leg.playerWon === false).length

      return {
        completedAt: game.completedAt || game.createdAt,
        playerName: game.player.name,
        opponentName: game.opponentName,
        result: game.playerWon === true ? 'Won' : game.playerWon === false ? 'Lost' : 'Draw',
        score: `${legsWon}-${legsLost}`,
        fixtureOpponent: game.fixture.opponentTeam,
        isHome: game.fixture.isHome,
        seasonName: game.fixture.season?.name || 'N/A',
      }
    })

    // Generate CSV
    const csv = generateCSV(exportData, gameDataColumns)

    // Determine filename
    let filename = 'game-data'
    if (playerId) {
      const player = exportData[0]?.playerName
      filename = `${player?.toLowerCase().replace(/\s+/g, '-')}-games`
    } else if (fixtureId) {
      const opponent = exportData[0]?.fixtureOpponent
      filename = `games-vs-${opponent?.toLowerCase().replace(/\s+/g, '-')}`
    } else if (seasonId) {
      const season = games[0]?.fixture.season?.name
      filename = `game-data-${season}`
    } else {
      filename = 'game-data-all-time'
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
    console.error('Error exporting game data:', error)
    return NextResponse.json({ error: 'Failed to export game data' }, { status: 500 })
  }
}
