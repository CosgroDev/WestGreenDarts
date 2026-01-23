import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface RecentGame {
  id: string
  playerName: string
  opponentName: string
  result: 'won' | 'lost' | 'draw'
  score: string
  date: string
  fixtureId: string
}

interface RecentGamesProps {
  games: RecentGame[]
}

export function RecentGames({ games }: RecentGamesProps) {
  if (games.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Recent Games
          </CardTitle>
          <CardDescription>Latest completed matches</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No games played yet. Start scoring to see recent activity!
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
          <Trophy className="h-5 w-5" />
          Recent Games
        </CardTitle>
        <CardDescription>Latest completed matches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {games.map((game) => {
            const resultColor =
              game.result === 'won'
                ? 'bg-green-50 border-green-200 text-green-700'
                : game.result === 'lost'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-gray-50 border-gray-200 text-gray-700'

            const resultBadge =
              game.result === 'won'
                ? 'bg-green-100 text-green-700'
                : game.result === 'lost'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'

            return (
              <Link
                key={game.id}
                href={`/fixtures/${game.fixtureId}`}
                className={`block p-3 rounded-lg border transition-all hover:shadow-md ${resultColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {game.playerName} vs {game.opponentName}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(game.date), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${resultBadge}`}>
                      {game.result.toUpperCase()} {game.score}
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
