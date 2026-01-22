import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Plus } from 'lucide-react'

export default function FixturesPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                Fixtures
              </h1>
              <p className="text-muted-foreground">
                View and manage upcoming and past fixtures
              </p>
            </div>
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Fixture
            </Button>
          </div>

          {/* Empty State */}
          <Card>
            <CardHeader>
              <CardTitle>No Fixtures Yet</CardTitle>
              <CardDescription>
                Schedule your first fixture to start playing games
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <Trophy className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground max-w-md">
                  Fixtures are matches against opponent teams. Create a season first, then add fixtures to it.
                </p>
                <Button>
                  Add First Fixture
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
