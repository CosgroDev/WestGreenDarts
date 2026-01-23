import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Home, Plane, MapPin } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow, format } from 'date-fns'

interface UpcomingFixture {
  id: string
  opponentTeam: string
  date: string
  isHome: boolean
  venue: string | null
}

interface UpcomingFixturesProps {
  fixtures: UpcomingFixture[]
}

export function UpcomingFixtures({ fixtures }: UpcomingFixturesProps) {
  if (fixtures.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Fixtures
          </CardTitle>
          <CardDescription>Next scheduled matches</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No upcoming fixtures scheduled
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Fixtures
        </CardTitle>
        <CardDescription>Next scheduled matches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fixtures.map((fixture) => {
            const fixtureDate = new Date(fixture.date)
            const isToday = format(fixtureDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
            const isTomorrow =
              format(fixtureDate, 'yyyy-MM-dd') ===
              format(new Date(Date.now() + 86400000), 'yyyy-MM-dd')

            let dateLabel = format(fixtureDate, 'EEE, MMM d')
            if (isToday) dateLabel = 'Today'
            else if (isTomorrow) dateLabel = 'Tomorrow'

            return (
              <Link
                key={fixture.id}
                href={`/fixtures/${fixture.id}`}
                className="block p-3 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all bg-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">
                      West Green Darts vs {fixture.opponentTeam}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {fixture.isHome ? (
                        <Home className="h-3 w-3 text-green-600" />
                      ) : (
                        <Plane className="h-3 w-3 text-blue-600" />
                      )}
                      <span>{fixture.isHome ? 'Home' : 'Away'}</span>
                    </div>
                    {fixture.venue && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{fixture.venue}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-primary">{dateLabel}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(fixtureDate, 'h:mm a')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(fixtureDate, { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
