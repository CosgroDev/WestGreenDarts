'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Undo2, Trophy } from 'lucide-react'
import Link from 'next/link'
import { getFinishGuidance } from '@/lib/finish-guidance'

interface Visit {
  id: string
  visitNumber: number
  isPlayer: boolean
  dart1: number | null
  dart2: number | null
  dart3: number | null
  totalScore: number
  isCheckout: boolean
}

interface Leg {
  id: string
  legNumber: number
  playerScore: number
  opponentScore: number
  playerWon: boolean | null
  playerStarted: boolean
  visits: Visit[]
}

interface Game {
  id: string
  opponentName: string
  isComplete: boolean
  playerWon: boolean | null
  player: {
    id: string
    name: string
  }
  legs: Leg[]
}

export default function GameScorePage({
  params,
}: {
  params: { id: string; gameId: string }
}) {
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentInput, setCurrentInput] = useState<number[]>([])
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [error, setError] = useState('')

  // Fetch game data
  useEffect(() => {
    fetchGame()
  }, [])

  const fetchGame = async () => {
    try {
      const response = await fetch(`/api/games/${params.gameId}`)
      if (response.ok) {
        const data = await response.json()
        setGame(data)

        // Determine whose turn it is based on last visit
        const currentLeg = data.legs.find((leg: Leg) => leg.playerWon === null)
        if (currentLeg) {
          const lastVisit = currentLeg.visits[currentLeg.visits.length - 1]
          if (lastVisit) {
            setIsPlayerTurn(!lastVisit.isPlayer)
          } else {
            setIsPlayerTurn(currentLeg.playerStarted)
          }
        }
      }
    } catch (err) {
      console.error('Error fetching game:', err)
      setError('Failed to load game')
    } finally {
      setLoading(false)
    }
  }

  const handleNumberClick = (num: number) => {
    if (currentInput.length < 3) {
      setCurrentInput([...currentInput, num])
    }
  }

  const handleBackspace = () => {
    setCurrentInput(currentInput.slice(0, -1))
  }

  const handleClear = () => {
    setCurrentInput([])
  }

  const handleSubmit = async () => {
    if (!game) return

    const currentLeg = game.legs.find((leg) => leg.playerWon === null)
    if (!currentLeg) {
      setError('No active leg found')
      return
    }

    // Pad with zeros if needed
    const darts = [...currentInput]
    while (darts.length < 3) {
      darts.push(0)
    }

    try {
      const response = await fetch(`/api/games/${params.gameId}/visit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          legId: currentLeg.id,
          isPlayer: isPlayerTurn,
          dart1: darts[0],
          dart2: darts[1],
          dart3: darts[2],
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to record visit')
      }

      const updatedGame = await response.json()
      setGame(updatedGame)
      setCurrentInput([])
      setIsPlayerTurn(!isPlayerTurn)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleUndo = async () => {
    try {
      const response = await fetch(`/api/games/${params.gameId}/undo`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to undo')
      }

      const updatedGame = await response.json()
      setGame(updatedGame)
      setCurrentInput([])

      // Determine whose turn it is after undo
      const currentLeg = updatedGame.legs.find((leg: Leg) => leg.playerWon === null)
      if (currentLeg) {
        const lastVisit = currentLeg.visits[currentLeg.visits.length - 1]
        if (lastVisit) {
          setIsPlayerTurn(!lastVisit.isPlayer)
        } else {
          setIsPlayerTurn(currentLeg.playerStarted)
        }
      }

      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0 flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </>
    )
  }

  if (!game) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0 flex items-center justify-center">
          <div>Game not found</div>
        </main>
      </>
    )
  }

  const currentLeg = game.legs.find((leg) => leg.playerWon === null)
  const currentScore = isPlayerTurn ? currentLeg?.playerScore : currentLeg?.opponentScore
  const totalInput = currentInput.reduce((sum, val) => sum + val, 0)
  const finishGuidance = currentScore && currentScore <= 170 ? getFinishGuidance(currentScore) : null

  // Calculate leg results
  const playerLegs = game.legs.filter((leg) => leg.playerWon === true).length
  const opponentLegs = game.legs.filter((leg) => leg.playerWon === false).length

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto p-4 max-w-4xl">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/fixtures/${params.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fixture
            </Link>
          </Button>

          {/* Game Complete */}
          {game.isComplete && (
            <Card className="mb-6 border-2 border-primary">
              <CardContent className="p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-primary" />
                <h2 className="text-2xl font-bold mb-2">
                  Game Complete!
                </h2>
                <p className="text-lg">
                  {game.playerWon === true
                    ? `${game.player.name} wins ${playerLegs}-${opponentLegs}!`
                    : game.playerWon === false
                    ? `${game.opponentName} wins ${opponentLegs}-${playerLegs}!`
                    : `Draw ${playerLegs}-${opponentLegs}!`}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Scoreboard */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* West Green Player */}
                <div className={`text-center p-4 rounded-lg ${isPlayerTurn && !game.isComplete ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary'}`}>
                  <div className="text-sm text-muted-foreground mb-1">{game.player.name}</div>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {currentLeg?.playerScore ?? 501}
                  </div>
                  <div className="text-sm font-semibold">Legs: {playerLegs}</div>
                </div>

                {/* Opponent */}
                <div className={`text-center p-4 rounded-lg ${!isPlayerTurn && !game.isComplete ? 'bg-primary/10 border-2 border-primary' : 'bg-secondary'}`}>
                  <div className="text-sm text-muted-foreground mb-1">{game.opponentName}</div>
                  <div className="text-5xl font-bold text-primary mb-2">
                    {currentLeg?.opponentScore ?? 501}
                  </div>
                  <div className="text-sm font-semibold">Legs: {opponentLegs}</div>
                </div>
              </div>

              {currentLeg && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Leg {currentLeg.legNumber} of 2 • Best of 2
                </div>
              )}
            </CardContent>
          </Card>

          {!game.isComplete && currentLeg && (
            <>
              {/* Current Turn */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-sm text-muted-foreground mb-2">Current Turn</div>
                    <div className="text-2xl font-bold">
                      {isPlayerTurn ? game.player.name : game.opponentName}
                    </div>
                  </div>

                  {/* Input Display */}
                  <div className="flex justify-center items-center gap-3 mb-4">
                    {[0, 1, 2].map((index) => (
                      <div
                        key={index}
                        className="w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-primary rounded-lg bg-white"
                      >
                        {currentInput[index] ?? '-'}
                      </div>
                    ))}
                    <div className="text-2xl font-bold ml-4">
                      = {totalInput}
                    </div>
                  </div>

                  {/* Finish Guidance */}
                  {finishGuidance && isPlayerTurn && (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-green-700 mb-1">
                          🎯 CHECKOUT AVAILABLE
                        </div>
                        <div className="text-lg font-bold text-green-900">
                          {finishGuidance.description}
                        </div>
                        <div className="text-sm text-green-700 mt-1">
                          {finishGuidance.combination.join(' → ')}
                        </div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4 text-center">
                      {error}
                    </div>
                  )}

                  {/* Numeric Keypad */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <Button
                        key={num}
                        variant="outline"
                        size="xl"
                        className="text-2xl font-bold h-16 hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleNumberClick(num)}
                        disabled={currentInput.length >= 3}
                      >
                        {num}
                      </Button>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      size="xl"
                      className="h-16"
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      className="text-2xl font-bold h-16 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleNumberClick(0)}
                      disabled={currentInput.length >= 3}
                    >
                      0
                    </Button>
                    <Button
                      variant="outline"
                      size="xl"
                      className="h-16"
                      onClick={handleBackspace}
                    >
                      ←
                    </Button>
                  </div>

                  {/* Submit and Undo */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleUndo}
                      disabled={!currentLeg.visits.length}
                    >
                      <Undo2 className="h-5 w-5 mr-2" />
                      Undo
                    </Button>
                    <Button
                      size="lg"
                      onClick={handleSubmit}
                      disabled={currentInput.length === 0}
                    >
                      Submit ({totalInput})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </>
  )
}
