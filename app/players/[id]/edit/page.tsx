import { Navigation } from '@/components/navigation'
import { PlayerForm } from '@/components/player-form'
import { getPlayerById } from '@/lib/db-direct'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

async function getPlayer(id: string) {
  try {
    const player = getPlayerById(id)
    return player
  } catch (error) {
    console.error('Error fetching player:', error)
    return null
  }
}

export default async function EditPlayerPage({ params }: PageProps) {
  const player = await getPlayer(params.id)

  if (!player) {
    notFound()
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-3xl">
          <PlayerForm
            mode="edit"
            playerId={player.id}
            initialData={{
              name: player.name,
              avatarUrl: player.avatarUrl || '',
              dartModel: player.dartModel || '',
              stemLength: player.stemLength || '',
              flightType: player.flightType || '',
              isActive: player.isActive,
            }}
          />
        </div>
      </main>
    </>
  )
}
