import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import { z } from 'zod'

const lineItemSchema = z.object({
  change_order_id: z.string().uuid(),
  description: z.string().min(1),
  quantity: z.coerce.number().nonnegative().optional().nullable(),
  unit: z.string().optional().nullable(),
  unit_price: z.coerce.number().nonnegative().optional().nullable(),
  total_price: z.coerce.number().nonnegative().optional().nullable(),
  sort_order: z.coerce.number().int().optional().nullable(),
})

export type LineItemInput = z.infer<typeof lineItemSchema>

export async function getLineItemsByChangeOrder(changeOrderId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_order_items')
    .select('*')
    .eq('change_order_id', changeOrderId)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as Tables<'change_order_items'>[]
}

export async function addLineItem(input: LineItemInput) {
  const parsed = lineItemSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_order_items')
    .insert(parsed as TablesInsert<'change_order_items'>)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'change_order_items'>
}

export async function updateLineItem(id: string, input: Partial<LineItemInput>) {
  const parsed = lineItemSchema.partial().parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_order_items')
    .update(parsed as TablesUpdate<'change_order_items'>)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'change_order_items'>
}

export async function deleteLineItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('change_order_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}

