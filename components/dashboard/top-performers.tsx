import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, Target, Trophy, Percent, Users } from 'lucide-react'
import Link from 'next/link'

interface TopPerformer {
  playerId: string
  playerName: string
  value: number
}

interface TopPerformersProps {
  highestAverage: TopPerformer[]
  most180s: TopPerformer[]
  highestCheckout: TopPerformer[]
  bestCheckoutPercentage: TopPerformer[]
  mostGames: TopPerformer[]
}

const getRankColor = (index: number) => {
  switch (index) {
    case 0:
      return 'text-yellow-600 font-bold' // Gold
    case 1:
      return 'text-gray-400 font-semibold' // Silver
    case 2:
      return 'text-orange-600 font-semibold' // Bronze
    default:
      return 'text-muted-foreground'
  }
}

const getRankBadge = (index: number) => {
  switch (index) {
    case 0:
      return '🥇'
    case 1:
      return '🥈'
    case 2:
      return '🥉'
    default:
      return `${index + 1}.`
  }
}

export function TopPerformers(props: TopPerformersProps) {
  const categories = [
    {
      title: 'Highest Average',
      icon: TrendingUp,
      data: props.highestAverage,
      format: (val: number) => val.toFixed(2),
      color: 'text-primary',
    },
    {
      title: 'Most 180s',
      icon: Target,
      data: props.most180s,
      format: (val: number) => val.toString(),
      color: 'text-blue-600',
    },
    {
      title: 'Highest Checkout',
      icon: Trophy,
      data: props.highestCheckout,
      format: (val: number) => val.toString(),
      color: 'text-green-600',
    },
    {
      title: 'Best Checkout %',
      icon: Percent,
      data: props.bestCheckoutPercentage,
      format: (val: number) => `${val.toFixed(1)}%`,
      color: 'text-purple-600',
    },
    {
      title: 'Most Games',
      icon: Users,
      data: props.mostGames,
      format: (val: number) => val.toString(),
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon

        return (
          <Card key={category.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className={`h-4 w-4 ${category.color}`} />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {category.data.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-4">
                  No data yet
                </div>
              ) : (
                <div className="space-y-2">
                  {category.data.map((performer, index) => (
                    <Link
                      key={performer.playerId}
                      href={`/players/${performer.playerId}/stats`}
                      className="flex items-center justify-between p-2 rounded hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getRankBadge(index)}</span>
                        <span className={`text-sm ${index < 3 ? 'font-medium' : ''}`}>
                          {performer.playerName}
                        </span>
                      </div>
                      <span className={`text-sm font-semibold ${getRankColor(index)}`}>
                        {category.format(performer.value)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
