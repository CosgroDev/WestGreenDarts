'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PinAuthPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num)
      setError('')
    }
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
    setError('')
  }

  const handleClear = () => {
    setPin('')
    setError('')
  }

  const handleSubmit = async () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(data.error || 'Invalid PIN')
        setPin('')
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && pin.length >= 4) {
      handleSubmit()
    } else if (e.key === 'Backspace') {
      handleBackspace()
    } else if (/^\d$/.test(e.key)) {
      handleNumberClick(e.key)
    }
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-primary">
            West Green Darts
          </CardTitle>
          <CardDescription className="text-base">
            Enter your PIN to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PIN Display */}
          <div className="flex justify-center items-center h-16 bg-secondary rounded-lg">
            <div className="flex gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border-2 border-primary transition-all"
                  style={{
                    backgroundColor: index < pin.length ? 'hsl(var(--primary))' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="xl"
                className="text-2xl font-semibold h-16 hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleNumberClick(num)}
                disabled={loading}
              >
                {num}
              </Button>
            ))}

            {/* Bottom Row: Clear, 0, Backspace */}
            <Button
              variant="outline"
              size="xl"
              className="text-lg font-semibold h-16"
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="text-2xl font-semibold h-16 hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleNumberClick('0')}
              disabled={loading}
            >
              0
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="text-lg font-semibold h-16"
              onClick={handleBackspace}
              disabled={loading}
            >
              ←
            </Button>
          </div>

          {/* Submit Button */}
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={handleSubmit}
            disabled={pin.length < 4 || loading}
          >
            {loading ? 'Verifying...' : 'Enter'}
          </Button>

          {/* Info Message */}
          <p className="text-xs text-center text-muted-foreground">
            Default PIN: 1234 (Change this in settings)
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
