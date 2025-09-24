'use client'

import * as React from 'react'

export function Toast({
  message,
  type = 'success',
  onClose,
  duration = 3000,
}: {
  message: string
  type?: 'success' | 'error'
  onClose?: () => void
  duration?: number
}) {
  React.useEffect(() => {
    const t = setTimeout(() => onClose?.(), duration)
    return () => clearTimeout(t)
  }, [onClose, duration])
  const styles = type === 'success' ? 'bg-green-600' : 'bg-red-600'
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
      <div
        className={`pointer-events-auto rounded-md ${styles} px-4 py-2 text-sm text-white shadow-lg`}
      >
        {message}
      </div>
    </div>
  )
}

type ToastKind = 'success' | 'error'

export function ToastFromSearchParams({
  message,
  type,
}: {
  message?: string | null
  type?: ToastKind | null
}) {
  const [open, setOpen] = React.useState(Boolean(message))
  React.useEffect(() => {
    setOpen(Boolean(message))
  }, [message])
  if (!message || !open) return null
  const resolvedType: ToastKind = type ?? 'success'
  return <Toast message={message} type={resolvedType} onClose={() => setOpen(false)} />
}
