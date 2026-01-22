import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single fixture
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const fixture = await prisma.fixture.findUnique({
      where: { id: params.id },
      include: {
        season: true,
        games: {
          include: {
            player: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!fixture) {
      return NextResponse.json(
        { error: 'Fixture not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(fixture)
  } catch (error) {
    console.error('Error fetching fixture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fixture' },
      { status: 500 }
    )
  }
}

// PUT update fixture
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { seasonId, date, opponentTeam, isHome, venue, notes } = body

    if (!date) {
      return NextResponse.json(
        { error: 'Fixture date is required' },
        { status: 400 }
      )
    }

    if (!opponentTeam || opponentTeam.trim() === '') {
      return NextResponse.json(
        { error: 'Opponent team name is required' },
        { status: 400 }
      )
    }

    const fixture = await prisma.fixture.update({
      where: { id: params.id },
      data: {
        ...(seasonId && { seasonId }),
        date: new Date(date),
        opponentTeam: opponentTeam.trim(),
        isHome: isHome !== undefined ? isHome : true,
        venue: venue || null,
        notes: notes || null,
      },
      include: {
        season: true,
      },
    })

    return NextResponse.json(fixture)
  } catch (error) {
    console.error('Error updating fixture:', error)
    return NextResponse.json(
      { error: 'Failed to update fixture' },
      { status: 500 }
    )
  }
}

// DELETE fixture
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.fixture.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting fixture:', error)
    return NextResponse.json(
      { error: 'Failed to delete fixture' },
      { status: 500 }
    )
  }
}
