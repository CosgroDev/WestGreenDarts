import { NextRequest, NextResponse } from 'next/server'
import { getSeasonWithFixtures, updateSeason, deleteSeason } from '@/lib/db-direct'

// GET single season
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const season = getSeasonWithFixtures(params.id)

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

    const season = updateSeason(params.id, {
      name: name.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      isCurrent: isCurrent || false,
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
    deleteSeason(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting season:', error)
    return NextResponse.json(
      { error: 'Failed to delete season' },
      { status: 500 }
    )
  }
}
