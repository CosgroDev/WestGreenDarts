import { NextRequest, NextResponse } from 'next/server'
import { getAllPlayers, createPlayer } from '@/lib/db-direct'

// GET all players
export async function GET() {
  try {
    const players = getAllPlayers()

    // Sort by isActive desc, then name asc
    players.sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json(players)
  } catch (error) {
    console.error('Error fetching players:', error)
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    )
  }
}

// POST create new player
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, avatarUrl, dartModel, stemLength, flightType } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      )
    }

    const player = createPlayer({
      name: name.trim(),
      avatarUrl: avatarUrl || undefined,
      dartModel: dartModel || undefined,
      stemLength: stemLength || undefined,
      flightType: flightType || undefined,
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error) {
    console.error('Error creating player:', error)
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    )
  }
}
