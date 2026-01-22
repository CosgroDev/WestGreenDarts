import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all players
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: [
        { isActive: 'desc' },
        { name: 'asc' },
      ],
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
    const { name, avatarUrl, dartModel, stemLength, flightType, isActive } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      )
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim(),
        avatarUrl: avatarUrl || null,
        dartModel: dartModel || null,
        stemLength: stemLength || null,
        flightType: flightType || null,
        isActive: isActive !== undefined ? isActive : true,
      },
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
