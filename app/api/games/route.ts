import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET games (optionally filtered by fixture)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fixtureId = searchParams.get('fixtureId')

    const games = await prisma.game.findMany({
      where: fixtureId ? { fixtureId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        player: true,
        fixture: {
          include: {
            season: true,
          },
        },
        legs: {
          orderBy: { legNumber: 'asc' },
        },
      },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error('Error fetching games:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}

// POST create new game
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fixtureId, playerId, opponentName, playerStartsFirst } = body

    if (!fixtureId) {
      return NextResponse.json(
        { error: 'Fixture ID is required' },
        { status: 400 }
      )
    }

    if (!playerId) {
      return NextResponse.json(
        { error: 'Player ID is required' },
        { status: 400 }
      )
    }

    if (!opponentName || opponentName.trim() === '') {
      return NextResponse.json(
        { error: 'Opponent name is required' },
        { status: 400 }
      )
    }

    // Create game with first leg (Best of 2 format)
    const game = await prisma.game.create({
      data: {
        fixtureId,
        playerId,
        opponentName: opponentName.trim(),
        playerStarted: playerStartsFirst !== undefined ? playerStartsFirst : true,
        isComplete: false,
        legs: {
          create: {
            legNumber: 1,
            playerScore: 501,
            opponentScore: 501,
            playerStarted: playerStartsFirst !== undefined ? playerStartsFirst : true,
          },
        },
      },
      include: {
        player: true,
        legs: true,
      },
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    )
  }
}
