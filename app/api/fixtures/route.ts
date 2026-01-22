import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all fixtures (optionally filtered by season)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const seasonId = searchParams.get('seasonId')

    const fixtures = await prisma.fixture.findMany({
      where: seasonId ? { seasonId } : undefined,
      orderBy: { date: 'desc' },
      include: {
        season: true,
        _count: {
          select: { games: true },
        },
      },
    })

    return NextResponse.json(fixtures)
  } catch (error) {
    console.error('Error fetching fixtures:', error)
    return NextResponse.json(
      { error: 'Failed to fetch fixtures' },
      { status: 500 }
    )
  }
}

// POST create new fixture
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { seasonId, date, opponentTeam, isHome, venue, notes } = body

    if (!seasonId) {
      return NextResponse.json(
        { error: 'Season ID is required' },
        { status: 400 }
      )
    }

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

    const fixture = await prisma.fixture.create({
      data: {
        seasonId,
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

    return NextResponse.json(fixture, { status: 201 })
  } catch (error) {
    console.error('Error creating fixture:', error)
    return NextResponse.json(
      { error: 'Failed to create fixture' },
      { status: 500 }
    )
  }
}
