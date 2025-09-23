import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import { changeOrderCreateSchema, changeOrderUpdateSchema, changeOrderStatusEnum, type ChangeOrderCreateInput, type ChangeOrderUpdateInput } from '@/lib/validations/change-order'

export async function getChangeOrders(opts?: { q?: string; status?: 'draft'|'pending'|'approved'; sort?: 'created_at'|'co_number'|'status'; dir?: 'asc'|'desc' }) {
  const supabase = await createClient()
  let query = supabase
    .from('change_order_summary')
    .select('*')
    .order(opts?.sort ?? 'created_at', { ascending: (opts?.dir ?? 'desc') === 'asc' })
  if (opts?.status) {
    query = query.eq('status', opts.status)
  }
  if (opts?.q && opts.q.trim()) {
    const q = `%${opts.q.trim()}%`
    query = query.or(`co_number.ilike.${q},title.ilike.${q},project_number.ilike.${q}`)
  }
  const { data, error } = await query
  if (error) throw error
  return data as Tables<'change_order_summary'>[]
}

export async function getChangeOrderById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Tables<'change_orders'>
}

export async function createChangeOrder(input: ChangeOrderCreateInput) {
  const parsed = changeOrderCreateSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .insert(parsed as TablesInsert<'change_orders'>)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'change_orders'>
}

export async function updateChangeOrder(id: string, input: ChangeOrderUpdateInput) {
  const parsed = changeOrderUpdateSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .update(parsed as TablesUpdate<'change_orders'>)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'change_orders'>
}

export async function deleteChangeOrder(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('change_orders')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function updateChangeOrderStatus(id: string, status: 'draft' | 'pending' | 'approved') {
  changeOrderStatusEnum.parse(status)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .update({ status } as TablesUpdate<'change_orders'>)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'change_orders'>
}
