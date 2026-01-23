import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, ArrowLeft, Plus, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getFixtureWithGames } from '@/lib/db-direct'
import { formatDateTime } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

async function getFixture(id: string) {
  try {
    const fixture = getFixtureWithGames(id)
    return fixture
  } catch (error) {
    console.error('Error fetching fixture:', error)
    return null
  }
}

export default async function FixtureDetailPage({ params }: PageProps) {
  const fixture = await getFixture(params.id)

  if (!fixture) {
    notFound()
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href={`/seasons/${fixture.seasonId}/fixtures`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fixtures
              </Link>
            </Button>

            {/* Fixture Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-2xl lg:text-3xl mb-2">
                      West Green Darts vs {fixture.opponentTeam}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDateTime(fixture.date)}
                      </div>
                      {fixture.venue && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {fixture.venue}
                        </div>
                      )}
                      <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {fixture.isHome ? 'Home' : 'Away'}
                      </div>
                    </div>
                  </div>
                  <Button size="lg" asChild>
                    <Link href={`/fixtures/${fixture.id}/game/new`}>
                      <Plus className="mr-2 h-5 w-5" />
                      New Game
                    </Link>
                  </Button>
                </div>
                {fixture.notes && (
                  <CardDescription className="mt-4 text-base">
                    {fixture.notes}
                  </CardDescription>
                )}
              </CardHeader>
            </Card>

            {/* Games List */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Games ({fixture.games.length})
              </h2>

              {fixture.games.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                        <Trophy className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground max-w-md">
                        No games recorded yet. Start tracking games for this fixture.
                      </p>
                      <Button asChild>
                        <Link href={`/fixtures/${fixture.id}/game/new`}>
                          Add First Game
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {fixture.games.map((game) => {
                    const legsWon = game.legs.filter((leg) => leg.playerWon === true).length
                    const legsLost = game.legs.filter((leg) => leg.playerWon === false).length
                    const gameResult = game.isComplete
                      ? game.playerWon === true
                        ? 'Won'
                        : game.playerWon === false
                        ? 'Lost'
                        : 'Draw'
                      : 'In Progress'

                    return (
                      <Card key={game.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">
                                  {game.player.name} vs {game.opponentName}
                                </h3>
                                {game.isComplete && (
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      game.playerWon === true
                                        ? 'bg-green-100 text-green-700'
                                        : game.playerWon === false
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {gameResult}
                                  </span>
                                )}
                                {!game.isComplete && (
                                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                    In Progress
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Best of 2 • Score: {legsWon}-{legsLost}
                              </div>
                            </div>
                            <Button asChild variant={game.isComplete ? 'outline' : 'default'}>
                              <Link href={`/fixtures/${fixture.id}/game/${game.id}/score`}>
                                {game.isComplete ? 'View Details' : 'Continue Game'}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
