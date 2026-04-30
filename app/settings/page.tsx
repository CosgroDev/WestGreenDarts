'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Calendar, CheckCircle, AlertCircle } from 'lucide-react'

interface Season {
  id: string
  name: string
  startDate: string | null
  endDate: string | null
  isCurrent: boolean
  fixtureCount?: number
}

export default function SettingsPage() {
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSeasons()
  }, [])

  async function fetchSeasons() {
    try {
      const res = await fetch('/api/seasons')
      if (!res.ok) throw new Error('Failed to fetch seasons')
      const data: Season[] = await res.json()
      setSeasons(data)
      const current = data.find((s) => s.isCurrent)
      if (current) setSelectedSeasonId(current.id)
    } catch {
      setMessage({ type: 'error', text: 'Failed to load seasons' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!selectedSeasonId) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/settings/active-season', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seasonId: selectedSeasonId }),
      })
      if (!res.ok) throw new Error('Failed to update active season')
      setSeasons((prev) =>
        prev.map((s) => ({ ...s, isCurrent: s.id === selectedSeasonId }))
      )
      setMessage({ type: 'success', text: 'Active season updated successfully' })
    } catch {
      setMessage({ type: 'error', text: 'Failed to update active season' })
    } finally {
      setSaving(false)
    }
  }

  const currentSeason = seasons.find((s) => s.id === selectedSeasonId)
  const hasChanged = seasons.find((s) => s.isCurrent)?.id !== selectedSeasonId

  return (
    <>
      <Navigation />
      <main className="min-h-screen lg:pl-64 pt-16 lg:pt-0">
        <div className="container mx-auto p-4 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8" />
              Settings
            </h1>
            <p className="text-muted-foreground">Configure global application preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Active Season
              </CardTitle>
              <CardDescription>
                The active season is used as the default across the dashboard and all statistics
                views.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="text-muted-foreground text-sm">Loading seasons…</div>
              ) : seasons.length === 0 ? (
                <div className="text-muted-foreground text-sm">
                  No seasons found. Create a season first.
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {seasons.map((season) => (
                      <label
                        key={season.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedSeasonId === season.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="activeSeason"
                          value={season.id}
                          checked={selectedSeasonId === season.id}
                          onChange={() => setSelectedSeasonId(season.id)}
                          className="accent-primary"
                        />
                        <div className="flex-1">
                          <div className="font-medium flex items-center gap-2">
                            {season.name}
                            {season.isCurrent && (
                              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          {(season.startDate || season.endDate) && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {season.startDate
                                ? new Date(season.startDate).toLocaleDateString('en-GB')
                                : ''}
                              {season.startDate && season.endDate && ' – '}
                              {season.endDate
                                ? new Date(season.endDate).toLocaleDateString('en-GB')
                                : ''}
                            </div>
                          )}
                          {season.fixtureCount !== undefined && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {season.fixtureCount} fixture{season.fixtureCount !== 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>

                  {message && (
                    <div
                      className={`flex items-center gap-2 text-sm p-3 rounded-md ${
                        message.type === 'success'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {message.type === 'success' ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      {message.text}
                    </div>
                  )}

                  <Button
                    onClick={handleSave}
                    disabled={saving || !hasChanged || !selectedSeasonId}
                    className="w-full"
                  >
                    {saving ? 'Saving…' : 'Save Settings'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
