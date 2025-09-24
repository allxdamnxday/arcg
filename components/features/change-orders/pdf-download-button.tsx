'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'

export function ChangeOrderPdfButton({
  changeOrderId,
  coNumber,
}: {
  changeOrderId: string
  coNumber: string
}) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleDownload() {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/change-orders/${changeOrderId}/pdf`, { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }
      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = `${coNumber || 'change-order'}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate PDF')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" onClick={handleDownload} disabled={loading}>
        {loading ? 'Generating…' : 'Download PDF'}
      </Button>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}
