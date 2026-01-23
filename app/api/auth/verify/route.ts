import { NextRequest, NextResponse } from 'next/server'
import { verifyPinDirect } from '@/lib/auth-direct'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length < 4) {
      return NextResponse.json(
        { error: 'PIN must be at least 4 digits' },
        { status: 400 }
      )
    }

    const isValid = await verifyPinDirect(pin)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Set an auth cookie (expires in 30 days)
    cookies().set('auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
