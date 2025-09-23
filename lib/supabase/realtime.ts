"use client"

import { createClient } from '@/lib/supabase/client'

export function subscribeToChangeOrders(onInsert?: (payload: any) => void, onUpdate?: (payload: any) => void, onDelete?: (payload: any) => void) {
  const supabase = createClient()
  const channel = supabase.channel('co-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'change_orders' }, (payload) => onInsert?.(payload))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'change_orders' }, (payload) => onUpdate?.(payload))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'change_orders' }, (payload) => onDelete?.(payload))
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToProjects(onInsert?: (payload: any) => void, onUpdate?: (payload: any) => void, onDelete?: (payload: any) => void) {
  const supabase = createClient()
  const channel = supabase.channel('project-changes')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'projects' }, (payload) => onInsert?.(payload))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => onUpdate?.(payload))
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'projects' }, (payload) => onDelete?.(payload))
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

