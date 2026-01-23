import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Plus, ArrowLeft, Home, Plane } from 'lucide-react'
import Link from 'next/link'
import { getSeasonById, getAllFixturesWithRelations } from '@/lib/db-direct'
import { formatDateTime } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

async function getSeasonWithFixtures(id: string) {
  try {
    const season = getSeasonById(id)
    if (!season) return null

    const allFixtures = getAllFixturesWithRelations()
    const fixtures = allFixtures
      .filter(f => f.seasonId === id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      ...season,
      fixtures
    }
  } catch (error) {
    console.error('Error fetching season:', error)
    return null
  }
}

export default async function SeasonFixturesPage({ params }: PageProps) {
  const season = await getSeasonWithFixtures(params.id)

  if (!season) {
    notFound()
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/seasons">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Seasons
              </Link>
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {season.name} Fixtures
                </h1>
                <p className="text-muted-foreground">
                  {season.isCurrent && '(Current Season) '}
                  {season.fixtures.length} fixture{season.fixtures.length !== 1 ? 's' : ''}
                </p>
              </div>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Add Fixture
              </Button>
            </div>
          </div>

          {season.fixtures.length === 0 ? (
            /* Empty State */
            <Card>
              <CardHeader>
                <CardTitle>No Fixtures Yet</CardTitle>
                <CardDescription>
                  Add your first fixture for this season
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Fixtures are matches against opponent teams. Add one to start tracking games.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Fixtures List */
            <div className="space-y-4">
              {season.fixtures.map((fixture) => (
                <Card key={fixture.id} className="hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-full ${fixture.isHome ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                            {fixture.isHome ? <Home className="h-4 w-4" /> : <Plane className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold">
                              West Green Darts vs {fixture.opponentTeam}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {fixture.isHome ? 'Home' : 'Away'}
                              {fixture.venue && ` • ${fixture.venue}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {formatDateTime(fixture.date)}
                        </div>
                        {fixture.notes && (
                          <div className="text-sm text-muted-foreground italic mt-2">
                            {fixture.notes}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span>{fixture._count.games} game{fixture._count.games !== 1 ? 's' : ''} recorded</span>
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/fixtures/${fixture.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
