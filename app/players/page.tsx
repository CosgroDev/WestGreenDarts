import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UserPlus } from 'lucide-react'
import Link from 'next/link'

export default function PlayersPage() {
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

          {/* Empty State */}
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
        </div>
      </main>
    </>
  )
}
