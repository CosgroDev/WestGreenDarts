import { Navigation } from '@/components/navigation'
import { PlayerForm } from '@/components/player-form'

export default function NewPlayerPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-3xl">
          <PlayerForm mode="create" />
        </div>
      </main>
    </>
  )
}
