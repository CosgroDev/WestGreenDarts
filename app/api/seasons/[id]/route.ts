import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single season
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const season = await prisma.season.findUnique({
      where: { id: params.id },
      include: {
        fixtures: {
          orderBy: { date: 'asc' },
        },
      },
    })

    if (!season) {
      return NextResponse.json(
        { error: 'Season not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(season)
  } catch (error) {
    console.error('Error fetching season:', error)
    return NextResponse.json(
      { error: 'Failed to fetch season' },
      { status: 500 }
    )
  }
}

// PUT update season
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, startDate, endDate, isCurrent } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Season name is required' },
        { status: 400 }
      )
    }

    // If this season is being marked as current, unset other current seasons
    if (isCurrent) {
      await prisma.season.updateMany({
        where: { isCurrent: true, id: { not: params.id } },
        data: { isCurrent: false },
      })
    }

    const season = await prisma.season.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isCurrent: isCurrent || false,
      },
    })

    return NextResponse.json(season)
  } catch (error) {
    console.error('Error updating season:', error)
    return NextResponse.json(
      { error: 'Failed to update season' },
      { status: 500 }
    )
  }
}

// DELETE season
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.season.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting season:', error)
    return NextResponse.json(
      { error: 'Failed to delete season' },
      { status: 500 }
    )
  }
}
