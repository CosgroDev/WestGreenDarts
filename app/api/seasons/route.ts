import { NextRequest, NextResponse } from 'next/server'
import { getAllSeasonsWithFixtureCount, createSeason } from '@/lib/db-direct'

// GET all seasons
export async function GET() {
  try {
    const seasons = getAllSeasonsWithFixtureCount()
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

    const season = createSeason({
      name: name.trim(),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      isCurrent: isCurrent || false,
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
