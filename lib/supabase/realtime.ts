'use client'

import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import type { Tables } from '@/types/database'

type ChangeOrderPayload = RealtimePostgresChangesPayload<Tables<'change_orders'>>
type ProjectPayload = RealtimePostgresChangesPayload<Tables<'projects'>>

export function subscribeToChangeOrders(
  onInsert?: (payload: ChangeOrderPayload) => void,
  onUpdate?: (payload: ChangeOrderPayload) => void,
  onDelete?: (payload: ChangeOrderPayload) => void
) {
  const supabase = createClient()
  const channel = supabase
    .channel('co-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'change_orders' },
      (payload) => onInsert?.(payload as ChangeOrderPayload)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'change_orders' },
      (payload) => onUpdate?.(payload as ChangeOrderPayload)
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'change_orders' },
      (payload) => onDelete?.(payload as ChangeOrderPayload)
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToProjects(
  onInsert?: (payload: ProjectPayload) => void,
  onUpdate?: (payload: ProjectPayload) => void,
  onDelete?: (payload: ProjectPayload) => void
) {
  const supabase = createClient()
  const channel = supabase
    .channel('project-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) =>
      onInsert?.(payload as ProjectPayload)
    )
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) =>
      onUpdate?.(payload as ProjectPayload)
    )
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'projects' }, (payload) =>
      onDelete?.(payload as ProjectPayload)
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
