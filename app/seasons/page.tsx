import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SeasonDialog } from '@/components/season-dialog'
import { Calendar, Trophy } from 'lucide-react'
import Link from 'next/link'
import { getAllSeasonsWithFixtureCount } from '@/lib/db-direct'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getSeasons() {
  try {
    const seasons = getAllSeasonsWithFixtureCount()
    return seasons
  } catch (error) {
    console.error('Error fetching seasons:', error)
    return []
  }
}

export default async function SeasonsPage() {
  const seasons = await getSeasons()

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                Seasons
              </h1>
              <p className="text-muted-foreground">
                Organize your fixtures by season
              </p>
            </div>
            <SeasonDialog />
          </div>

          {seasons.length === 0 ? (
            /* Empty State */
            <Card>
              <CardHeader>
                <CardTitle>No Seasons Yet</CardTitle>
                <CardDescription>
                  Create your first season to start organizing fixtures
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Seasons help you organize fixtures by year (e.g., 25/26, 26/27). Create a season to get started.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Seasons List */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {seasons.map((season) => (
                <Card key={season.id} className={season.isCurrent ? 'border-primary border-2' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{season.name}</CardTitle>
                        {season.isCurrent && (
                          <span className="text-xs text-primary font-semibold">Current Season</span>
                        )}
                      </div>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {(season.startDate || season.endDate) && (
                        <div className="text-sm text-muted-foreground">
                          {season.startDate && formatDate(season.startDate)}
                          {season.startDate && season.endDate && ' - '}
                          {season.endDate && formatDate(season.endDate)}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>{season._count.fixtures} fixture{season._count.fixtures !== 1 ? 's' : ''}</span>
                      </div>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={`/seasons/${season.id}/fixtures`}>
                          View Fixtures
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
