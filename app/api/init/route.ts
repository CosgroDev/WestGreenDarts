import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { initializePin } from '@/lib/auth'

// GET initialize the database
export async function GET() {
  try {
    // Try to initialize the PIN
    await initializePin()

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully. Default PIN: 1234',
    })
  } catch (error: any) {
    console.error('Initialization error:', error)
    return NextResponse.json(
      {
        error: 'Failed to initialize database',
        details: error.message,
      },
      { status: 500 }
    )
  }
}
