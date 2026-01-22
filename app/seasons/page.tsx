import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'

export default function SeasonsPage() {
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
            <Button size="lg">
              <Plus className="mr-2 h-5 w-5" />
              New Season
            </Button>
          </div>

          {/* Empty State */}
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
                <Button>
                  Create Season 25/26
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
