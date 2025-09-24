'use client'

import * as React from 'react'
import { Dialog, DialogFooter, DialogHeader } from '@/components/ui/dialog'

export function ConfirmDialog({
  title = 'Are you sure?',
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  action,
  trigger,
}: {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  action: (formData: FormData) => Promise<void>
  trigger: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeader>{title}</DialogHeader>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        <DialogFooter>
          <button className="rounded-md border px-3 py-2 text-sm" onClick={() => setOpen(false)}>
            {cancelLabel}
          </button>
          <form action={action}>
            <button className="rounded-md border px-3 py-2 text-sm">{confirmLabel}</button>
          </form>
        </DialogFooter>
      </Dialog>
    </>
  )
}
