'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

interface ExportButtonProps {
  endpoint: string
  label?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function ExportButton({
  endpoint,
  label = 'Export CSV',
  variant = 'outline',
  size = 'sm'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    try {
      setIsExporting(true)

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error('Export failed')
      }

      // Get the filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition')
      let filename = 'export.csv'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Download the file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
    >
      <Download className="h-4 w-4 mr-2" />
      {isExporting ? 'Exporting...' : label}
    </Button>
  )
}
