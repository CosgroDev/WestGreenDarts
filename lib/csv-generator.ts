/**
 * CSV Generation Utility
 * Converts data objects to CSV format for export
 */

export interface CSVColumn {
  key: string
  label: string
  format?: (value: any) => string
}

export function generateCSV(data: any[], columns: CSVColumn[]): string {
  if (data.length === 0) {
    return columns.map((col) => col.label).join(',')
  }

  // Header row
  const headers = columns.map((col) => col.label).join(',')

  // Data rows
  const rows = data.map((item) => {
    return columns
      .map((col) => {
        let value = item[col.key]

        // Apply custom formatting if provided
        if (col.format && value !== null && value !== undefined) {
          value = col.format(value)
        }

        // Handle null/undefined
        if (value === null || value === undefined) {
          return ''
        }

        // Convert to string and escape if needed
        value = String(value)

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = '"' + value.replace(/"/g, '""') + '"'
        }

        return value
      })
      .join(',')
  })

  return [headers, ...rows].join('\n')
}

export function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Player Statistics Export Columns
export const playerStatsColumns: CSVColumn[] = [
  { key: 'playerName', label: 'Player Name' },
  { key: 'totalGames', label: 'Games Played' },
  { key: 'gamesWon', label: 'Games Won' },
  {
    key: 'winPercentage',
    label: 'Win %',
    format: (val) => val.toFixed(1),
  },
  { key: 'totalLegs', label: 'Legs Played' },
  { key: 'legsWon', label: 'Legs Won' },
  {
    key: 'legWinPercentage',
    label: 'Leg Win %',
    format: (val) => val.toFixed(1),
  },
  {
    key: 'threeDartAverage',
    label: '3-Dart Average',
    format: (val) => val.toFixed(2),
  },
  {
    key: 'firstNineAverage',
    label: 'First 9 Average',
    format: (val) => val.toFixed(2),
  },
  { key: 'totalVisits', label: 'Total Visits' },
  { key: 'scores60Plus', label: '60+' },
  { key: 'scores80Plus', label: '80+' },
  { key: 'scores100Plus', label: '100+' },
  { key: 'scores120Plus', label: '120+' },
  { key: 'scores140Plus', label: '140+' },
  { key: 'scores170Plus', label: '170+' },
  { key: 'total180s', label: '180s' },
  { key: 'highFinish', label: 'High Finish' },
  { key: 'finishes100Plus', label: '100+ Finishes' },
  { key: 'bestLeg', label: 'Best Leg (darts)' },
  { key: 'worstLeg', label: 'Worst Leg (darts)' },
  { key: 'checkoutAttempts', label: 'Checkout Attempts' },
  { key: 'successfulCheckouts', label: 'Successful Checkouts' },
  {
    key: 'checkoutPercentage',
    label: 'Checkout %',
    format: (val) => val.toFixed(1),
  },
  { key: 'legsStarted', label: 'Legs Started' },
  { key: 'legsWonWhenStarted', label: 'Legs Won When Started' },
  {
    key: 'keepPercentage',
    label: 'Keep %',
    format: (val) => val.toFixed(1),
  },
  { key: 'legsNotStarted', label: 'Legs Not Started' },
  { key: 'legsWonWhenNotStarted', label: 'Legs Won When Not Started' },
  {
    key: 'breakPercentage',
    label: 'Break %',
    format: (val) => val.toFixed(1),
  },
]

// Game Data Export Columns
export const gameDataColumns: CSVColumn[] = [
  {
    key: 'completedAt',
    label: 'Date',
    format: (val) => new Date(val).toLocaleString(),
  },
  { key: 'playerName', label: 'West Green Player' },
  { key: 'opponentName', label: 'Opponent' },
  { key: 'result', label: 'Result' },
  { key: 'score', label: 'Score' },
  { key: 'fixtureOpponent', label: 'Fixture Opponent' },
  { key: 'isHome', label: 'Home/Away', format: (val) => (val ? 'Home' : 'Away') },
  { key: 'seasonName', label: 'Season' },
]

// Fixture Results Export Columns
export const fixtureResultsColumns: CSVColumn[] = [
  {
    key: 'date',
    label: 'Date',
    format: (val) => new Date(val).toLocaleDateString(),
  },
  { key: 'opponentTeam', label: 'Opponent' },
  { key: 'isHome', label: 'Home/Away', format: (val) => (val ? 'Home' : 'Away') },
  { key: 'venue', label: 'Venue' },
  { key: 'gamesPlayed', label: 'Games Played' },
  { key: 'gamesWon', label: 'Games Won' },
  { key: 'gamesDraw', label: 'Games Draw' },
  { key: 'gamesLost', label: 'Games Lost' },
  { key: 'seasonName', label: 'Season' },
]
