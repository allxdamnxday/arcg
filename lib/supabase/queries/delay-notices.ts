import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'

export async function listDelayNotices(opts?: { q?: string; status?: 'draft'|'sent'|'acknowledged' }) {
  const supabase = await createClient()
  let query = supabase.from('delay_notices').select('*').order('created_at', { ascending: false })
  if (opts?.status) query = query.eq('status', opts.status)
  if (opts?.q && opts.q.trim()) {
    const q = `%${opts.q.trim()}%`
    query = query.or(`title.ilike.${q},description.ilike.${q}`)
  }
  const { data, error } = await query
  if (error) throw error
  return data as Tables<'delay_notices'>[]
}

export async function getDelayNotice(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('delay_notices').select('*').eq('id', id).single()
  if (error) throw error
  return data as Tables<'delay_notices'>
}

export async function createDelayNotice(input: TablesInsert<'delay_notices'>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('delay_notices').insert(input).select('*').single()
  if (error) throw error
  return data as Tables<'delay_notices'>
}

export async function updateDelayNotice(id: string, input: TablesUpdate<'delay_notices'>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('delay_notices').update(input).eq('id', id).select('*').single()
  if (error) throw error
  return data as Tables<'delay_notices'>
}

