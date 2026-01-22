import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, TrendingUp, Target } from 'lucide-react'

interface Player {
  id: string
  name: string
  avatarUrl?: string | null
  dartModel?: string | null
  stemLength?: string | null
  flightType?: string | null
  isActive: boolean
  createdAt: Date
}

interface PlayerCardProps {
  player: Player
}

export function PlayerCard({ player }: PlayerCardProps) {
  return (
    <Card className={!player.isActive ? 'opacity-60' : ''}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {player.avatarUrl ? (
              <img
                src={player.avatarUrl}
                alt={player.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                {player.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h3 className="text-lg font-semibold truncate">{player.name}</h3>
                {!player.isActive && (
                  <span className="text-xs text-muted-foreground">Inactive</span>
                )}
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/players/${player.id}/edit`}>
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Equipment Details */}
            {(player.dartModel || player.stemLength || player.flightType) && (
              <div className="space-y-1 text-sm text-muted-foreground mb-3">
                {player.dartModel && (
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    <span className="truncate">{player.dartModel}</span>
                  </div>
                )}
                {player.stemLength && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Stem:</span>
                    <span>{player.stemLength}</span>
                  </div>
                )}
                {player.flightType && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs">Flight:</span>
                    <span>{player.flightType}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={`/players/${player.id}/stats`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Stats
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
