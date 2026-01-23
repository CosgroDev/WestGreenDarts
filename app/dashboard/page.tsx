import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Trophy, TrendingUp, Award, Target } from 'lucide-react'
import { TopPerformers } from '@/components/dashboard/top-performers'
import { RecentGames } from '@/components/dashboard/recent-games'
import { UpcomingFixtures } from '@/components/dashboard/upcoming-fixtures'

export const dynamic = 'force-dynamic'

async function getTeamStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/statistics/team`, {
      cache: 'no-store',
    })
    if (!response.ok) throw new Error('Failed to fetch team stats')
    return await response.json()
  } catch (error) {
    console.error('Error fetching team stats:', error)
    return null
  }
}

export default async function DashboardPage() {
  const teamStats = await getTeamStats()

  const hasData = teamStats && teamStats.totalGames > 0

  return (
    <>
      <Navigation />

      {/* Main Content */}
      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to West Green Darts team management
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Players
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats?.totalPlayers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Active team members
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Current Season
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamStats?.currentSeason?.name || '25/26'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {teamStats?.currentSeason ? 'Season in progress' : 'No active season'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fixtures
                </CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamStats?.totalFixtures || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {teamStats?.fixturesCompleted || 0} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Average
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {teamStats?.teamAverage ? teamStats.teamAverage.toFixed(2) : '--'}
                </div>
                <p className="text-xs text-muted-foreground">
                  3-dart average
                </p>
              </CardContent>
            </Card>
          </div>

          {hasData ? (
            <div className="space-y-8">
              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Team Performance
                  </CardTitle>
                  <CardDescription>Overall team statistics and achievements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Games</div>
                      <div className="text-3xl font-bold">{teamStats.totalGames}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        W: {teamStats.gamesWon} | D: {teamStats.gamesDraw} | L: {teamStats.gamesLost}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Total 180s</div>
                      <div className="text-3xl font-bold text-primary">
                        {teamStats.aggregateStats.total180s}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Maximum scores</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">100+ Scores</div>
                      <div className="text-3xl font-bold">
                        {teamStats.aggregateStats.scores100Plus}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Ton+ visits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">Highest Finish</div>
                      <div className="text-3xl font-bold text-primary">
                        {teamStats.aggregateStats.highFinish}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Team record</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <TopPerformers topPerformers={teamStats.topPerformers} />

              {/* Recent Games & Upcoming Fixtures */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentGames games={teamStats.recentGames} />
                <UpcomingFixtures fixtures={teamStats.upcomingFixtures} />
              </div>
            </div>
          ) : (
            /* Getting Started */
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>
                  Set up your team to start tracking games and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Add Players</h3>
                    <p className="text-sm text-muted-foreground">
                      Register your team members with their profiles and equipment details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Create a Season</h3>
                    <p className="text-sm text-muted-foreground">
                      Set up your current season (e.g., 25/26) to organize fixtures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Schedule Fixtures</h3>
                    <p className="text-sm text-muted-foreground">
                      Add fixtures against opponents with dates and venues.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Start Scoring Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Track live 501 games and watch your statistics build up automatically.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
