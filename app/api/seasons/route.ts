import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all seasons
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { fixtures: true },
        },
      },
    })

    return NextResponse.json(seasons)
  } catch (error) {
    console.error('Error fetching seasons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch seasons' },
      { status: 500 }
    )
  }
}

// POST create new season
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, startDate, endDate, isCurrent } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Season name is required' },
        { status: 400 }
      )
    }

    // If this season is marked as current, unset other current seasons
    if (isCurrent) {
      await prisma.season.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      })
    }

    const season = await prisma.season.create({
      data: {
        name: name.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
      },
    })

    return NextResponse.json(season, { status: 201 })
  } catch (error) {
    console.error('Error creating season:', error)
    return NextResponse.json(
      { error: 'Failed to create season' },
      { status: 500 }
    )
  }
}
