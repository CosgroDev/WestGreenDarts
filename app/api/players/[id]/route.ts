import { NextRequest, NextResponse } from 'next/server'
import { getPlayerById, updatePlayer, deletePlayer } from '@/lib/db-direct'

// GET single player
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = getPlayerById(params.id)

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error fetching player:', error)
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    )
  }
}

// PUT update player
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, avatarUrl, dartModel, stemLength, flightType, isActive } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      )
    }

    const player = updatePlayer(params.id, {
      name: name.trim(),
      avatarUrl: avatarUrl || null,
      dartModel: dartModel || null,
      stemLength: stemLength || null,
      flightType: flightType || null,
      isActive: isActive !== undefined ? isActive : true,
    })

    return NextResponse.json(player)
  } catch (error) {
    console.error('Error updating player:', error)
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    )
  }
}

// DELETE player
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deletePlayer(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting player:', error)
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    )
  }
}
