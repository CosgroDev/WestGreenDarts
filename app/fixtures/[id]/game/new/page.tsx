'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  isActive: boolean
}

export default function NewGamePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [players, setPlayers] = useState<Player[]>([])
  const [formData, setFormData] = useState({
    playerId: '',
    opponentName: '',
    playerStartsFirst: true,
  })

  // Fetch active players
  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch('/api/players')
        if (response.ok) {
          const data = await response.json()
          setPlayers(data.filter((p: Player) => p.isActive))
        }
      } catch (err) {
        console.error('Error fetching players:', err)
      }
    }
    fetchPlayers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.playerId) {
      setError('Please select a West Green player')
      return
    }

    if (!formData.opponentName.trim()) {
      setError('Please enter opponent name')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fixtureId: params.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create game')
      }

      const game = await response.json()
      router.push(`/fixtures/${params.id}/game/${game.id}/score`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-2xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/fixtures/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fixture
            </Link>
          </Button>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>New Game</CardTitle>
                <CardDescription>
                  Set up a new 501 game (Best of 2 legs)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                    {error}
                  </div>
                )}

                {/* West Green Player Selection */}
                <div className="space-y-2">
                  <label htmlFor="playerId" className="text-sm font-medium">
                    West Green Player <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="playerId"
                    value={formData.playerId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, playerId: e.target.value }))
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select a player...</option>
                    {players.map((player) => (
                      <option key={player.id} value={player.id}>
                        {player.name}
                      </option>
                    ))}
                  </select>
                  {players.length === 0 && (
                    <p className="text-xs text-muted-foreground">
                      No active players found. Add players first.
                    </p>
                  )}
                </div>

                {/* Opponent Name */}
                <div className="space-y-2">
                  <label htmlFor="opponentName" className="text-sm font-medium">
                    Opponent Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="opponentName"
                    placeholder="Enter opponent's name"
                    value={formData.opponentName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, opponentName: e.target.value }))
                    }
                    required
                    className="text-base"
                  />
                </div>

                {/* Who Starts First */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Who starts first?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.playerStartsFirst ? 'default' : 'outline'}
                      className="h-auto py-4"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, playerStartsFirst: true }))
                      }
                    >
                      <div className="text-center">
                        <div className="font-semibold">West Green</div>
                        <div className="text-xs opacity-80">Starts first</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.playerStartsFirst ? 'default' : 'outline'}
                      className="h-auto py-4"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, playerStartsFirst: false }))
                      }
                    >
                      <div className="text-center">
                        <div className="font-semibold">Opponent</div>
                        <div className="text-xs opacity-80">Starts first</div>
                      </div>
                    </Button>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                  <strong>Best of 2 Format:</strong> Each game consists of up to 2 legs. Win 2-0,
                  draw 1-1, or lose 0-2. The game ends when one player wins 2 legs or both legs are
                  complete.
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={loading || players.length === 0}>
                    {loading ? 'Creating...' : 'Start Game'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </main>
    </>
  )
}
