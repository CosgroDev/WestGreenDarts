import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlayerCard } from '@/components/player-card'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'
import { getAllPlayers } from '@/lib/db-direct'

export const dynamic = 'force-dynamic'

async function getPlayers() {
  try {
    const players = getAllPlayers()
    // Sort by isActive desc, then name asc
    players.sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1
      }
      return a.name.localeCompare(b.name)
    })
    return players
  } catch (error) {
    console.error('Error fetching players:', error)
    return []
  }
}

export default async function PlayersPage() {
  const players = await getPlayers()

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                Players
              </h1>
              <p className="text-muted-foreground">
                Manage your team members and their profiles
              </p>
            </div>
            <Button size="lg" asChild>
              <Link href="/players/new">
                <UserPlus className="mr-2 h-5 w-5" />
                Add Player
              </Link>
            </Button>
          </div>

          {players.length === 0 ? (
            /* Empty State */
            <Card>
              <CardHeader>
                <CardTitle>No Players Yet</CardTitle>
                <CardDescription>
                  Get started by adding your first team member
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                    <UserPlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground max-w-md">
                    Add players to your team with their darts equipment details and start tracking their performance.
                  </p>
                  <Button asChild>
                    <Link href="/players/new">
                      Add Your First Player
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Players Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
