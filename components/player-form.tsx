'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PlayerFormData {
  name: string
  avatarUrl?: string
  dartModel?: string
  stemLength?: string
  flightType?: string
  isActive: boolean
}

interface PlayerFormProps {
  initialData?: PlayerFormData
  playerId?: string
  mode: 'create' | 'edit'
}

export function PlayerForm({ initialData, playerId, mode }: PlayerFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<PlayerFormData>(
    initialData || {
      name: '',
      avatarUrl: '',
      dartModel: '',
      stemLength: '',
      flightType: '',
      isActive: true,
    }
  )

  const handleChange = (field: keyof PlayerFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Player name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const url = mode === 'create' ? '/api/players' : `/api/players/${playerId}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save player')
      }

      router.push('/players')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{mode === 'create' ? 'Add New Player' : 'Edit Player'}</CardTitle>
          <CardDescription>
            {mode === 'create'
              ? 'Register a new team member with their profile details'
              : 'Update player information and equipment details'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Player Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                placeholder="Enter player name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="avatarUrl" className="text-sm font-medium">
                Avatar URL (Optional)
              </label>
              <Input
                id="avatarUrl"
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={formData.avatarUrl}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                className="text-base"
              />
              <p className="text-xs text-muted-foreground">
                Link to player's profile picture
              </p>
            </div>
          </div>

          {/* Darts Equipment Profile */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">Darts Equipment Profile</h3>

            <div className="space-y-2">
              <label htmlFor="dartModel" className="text-sm font-medium">
                Dart Model/Type
              </label>
              <Input
                id="dartModel"
                placeholder="e.g., Target Carrera V2 21g"
                value={formData.dartModel}
                onChange={(e) => handleChange('dartModel', e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="stemLength" className="text-sm font-medium">
                Stem Length
              </label>
              <Input
                id="stemLength"
                placeholder="e.g., Medium, 35mm, Short"
                value={formData.stemLength}
                onChange={(e) => handleChange('stemLength', e.target.value)}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="flightType" className="text-sm font-medium">
                Flight Type/Design
              </label>
              <Input
                id="flightType"
                placeholder="e.g., Standard, Slim, Kite"
                value={formData.flightType}
                onChange={(e) => handleChange('flightType', e.target.value)}
                className="text-base"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 rounded border-input"
            />
            <label htmlFor="isActive" className="text-sm font-medium cursor-pointer">
              Active Player
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Add Player' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
