import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TrendingUp } from 'lucide-react'

interface PageProps {
  params: {
    id: string
  }
}

async function getPlayer(id: string) {
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
  const player = await getPlayer(params.id)

  if (!player) {
    notFound()
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
              {player.name} - Statistics
            </h1>
            <p className="text-muted-foreground">
              View comprehensive performance statistics
            </p>
          </div>

          {/* Coming Soon */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics Coming Soon</CardTitle>
              <CardDescription>
                Player statistics will be available after games are played
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground max-w-md">
                  Start playing and recording games to build up your statistics. All performance metrics will be calculated automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
