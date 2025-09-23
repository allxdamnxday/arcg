"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export function Dialog({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className={cn('relative z-10 w-full max-w-sm rounded-lg border bg-background p-4 shadow-lg')}>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2 text-lg font-semibold">{children}</div>
}
export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>
}

