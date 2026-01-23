import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TrendingUp, Trophy, Target, Percent, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ExportButton } from '@/components/export-button'

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

async function getPlayerWithStats(id: string) {
  try {
    const player = await prisma.player.findUnique({
      where: { id },
      include: {
        statistics: {
          where: { seasonId: null }, // All-time stats
        },
      },
    })
    return player
  } catch (error) {
    console.error('Error fetching player:', error)
    return null
  }
}

export default async function PlayerStatsPage({ params }: PageProps) {
  const player = await getPlayerWithStats(params.id)

  if (!player) {
    notFound()
  }

  const stats = player.statistics[0]

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/players">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Players
              </Link>
            </Button>
            {stats && stats.totalGames > 0 && (
              <div className="flex gap-2">
                <ExportButton
                  endpoint={`/api/export/players?playerId=${params.id}`}
                  label="Export Stats"
                />
                <ExportButton
                  endpoint={`/api/export/games?playerId=${params.id}`}
                  label="Export Games"
                />
              </div>
            )}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {player.name} - Statistics
            </h1>
            <p className="text-muted-foreground">
              All-time performance statistics
            </p>
          </div>

          {!stats || stats.totalGames === 0 ? (
            /* No Statistics Yet */
            <Card>
              <CardHeader>
                <CardTitle>No Statistics Yet</CardTitle>
                <CardDescription>
                  Start playing games to build up statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Play and record games to see comprehensive statistics automatically calculated here.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Games Played</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalGames}</div>
                    <p className="text-xs text-muted-foreground">
                      Won: {stats.gamesWon} ({((stats.gamesWon / stats.totalGames) * 100).toFixed(1)}%)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Legs Played</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalLegs}</div>
                    <p className="text-xs text-muted-foreground">
                      Won: {stats.legsWon} ({((stats.legsWon / stats.totalLegs) * 100).toFixed(1)}%)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>3 Dart Average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary">{stats.threeDartAverage}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.totalVisits} visits
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>First 9 Average</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.firstNineAverage}</div>
                    <p className="text-xs text-muted-foreground">
                      Opening visits
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Score Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Score Distribution
                  </CardTitle>
                  <CardDescription>High scoring visits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.scores60Plus}</div>
                      <div className="text-xs text-muted-foreground">60+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.scores80Plus}</div>
                      <div className="text-xs text-muted-foreground">80+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.scores100Plus}</div>
                      <div className="text-xs text-muted-foreground">100+ (Tons)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.scores120Plus}</div>
                      <div className="text-xs text-muted-foreground">120+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.scores140Plus}</div>
                      <div className="text-xs text-muted-foreground">140+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.scores170Plus}</div>
                      <div className="text-xs text-muted-foreground">170+</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{stats.total180s}</div>
                      <div className="text-xs text-muted-foreground">180s (Max)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Finishing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Finishing Statistics
                  </CardTitle>
                  <CardDescription>Checkout performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">High Finish</div>
                      <div className="text-3xl font-bold text-primary">{stats.highFinish}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">100+ Finishes</div>
                      <div className="text-3xl font-bold">{stats.finishes100Plus}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Best Leg</div>
                      <div className="text-3xl font-bold">{stats.bestLeg ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">darts</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Worst Leg</div>
                      <div className="text-3xl font-bold">{stats.worstLeg ?? '-'}</div>
                      <div className="text-xs text-muted-foreground">darts</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Percent className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Success rates and percentages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Checkout %</div>
                      <div className="text-4xl font-bold text-primary mb-1">
                        {stats.checkoutPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.successfulCheckouts}/{stats.checkoutAttempts} successful
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Keep %</div>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {stats.keepPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.legsWonWhenStarted}/{stats.legsStarted} legs held
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-2">Break %</div>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {stats.breakPercentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stats.legsWonWhenNotStarted}/{stats.legsNotStarted} legs broken
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
