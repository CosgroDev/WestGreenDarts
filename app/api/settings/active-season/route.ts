import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSeason, updateSeason } from '@/lib/db-direct'

export async function GET() {
  try {
    const currentSeason = getCurrentSeason()
    return NextResponse.json({ currentSeason })
  } catch (error) {
    console.error('Error fetching active season:', error)
    return NextResponse.json({ error: 'Failed to fetch active season' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { seasonId } = body

    if (!seasonId) {
      return NextResponse.json({ error: 'seasonId is required' }, { status: 400 })
    }

    const season = updateSeason(seasonId, { isCurrent: true })
    return NextResponse.json({ currentSeason: season })
  } catch (error) {
    console.error('Error setting active season:', error)
    return NextResponse.json({ error: 'Failed to set active season' }, { status: 500 })
  }
}
