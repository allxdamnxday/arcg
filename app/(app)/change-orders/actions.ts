"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { changeOrderCreateSchema, changeOrderUpdateSchema, changeOrderStatusEnum } from '@/lib/validations/change-order'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

export async function createChangeOrderAction(formData: FormData) {
  const input = {
    project_id: String(formData.get('project_id') || ''),
    co_number: String(formData.get('co_number') || ''),
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    cost_impact: formData.get('cost_impact') as any,
    time_impact_days: formData.get('time_impact_days') as any,
    status: (formData.get('status') as any) || undefined,
  }
  const parsed = changeOrderCreateSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(', ') }
  }
  const supabase = await createClient()
  const { data, error } = await supabase.from('change_orders').insert(parsed.data).select('id').single()
  if (error) return { ok: false, error: error.message }
  redirect(`/change-orders/${data!.id}?m=Change%20order%20created&t=success`)
}

export async function updateChangeOrderAction(id: string, formData: FormData) {
  const input = {
    project_id: (formData.get('project_id') as string) || undefined,
    co_number: (formData.get('co_number') as string) || undefined,
    title: (formData.get('title') as string) || undefined,
    description: (formData.get('description') as string) || undefined,
    cost_impact: formData.get('cost_impact') as any,
    time_impact_days: formData.get('time_impact_days') as any,
    status: (formData.get('status') as any) || undefined,
  }
  const parsed = changeOrderUpdateSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.flatten().formErrors.join(', ') }
  }
  const supabase = await createClient()
  const { error } = await supabase.from('change_orders').update(parsed.data).eq('id', id)
  if (error) return { ok: false, error: error.message }
  redirect(`/change-orders/${id}?m=Change%20order%20updated&t=success`)
}

export async function updateChangeOrderStatusAction(id: string, status: 'draft' | 'pending' | 'approved') {
  changeOrderStatusEnum.parse(status)
  const supabase = await createClient()
  const { error } = await supabase.from('change_orders').update({ status }).eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard')
  return { ok: true }
}

export async function deleteChangeOrderAction(id: string, redirectTo?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('change_orders').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  revalidatePath('/dashboard')
  if (redirectTo) redirect(redirectTo)
  return { ok: true }
}

const lineItemSchema = z.object({
  change_order_id: z.string().uuid(),
  description: z.string().min(1),
  quantity: z.coerce.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  unit_price: z.coerce.number().optional().nullable(),
  total_price: z.coerce.number().optional().nullable(),
})

export async function addLineItemAction(formData: FormData) {
  const input = {
    change_order_id: String(formData.get('change_order_id') || ''),
    description: String(formData.get('description') || ''),
    quantity: formData.get('quantity') as any,
    unit: (formData.get('unit') as string) || undefined,
    unit_price: formData.get('unit_price') as any,
    total_price: formData.get('total_price') as any,
  }
  const parsed = lineItemSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.message }
  const supabase = await createClient()
  const baseTotal = (parsed.data.quantity ?? 0) * (parsed.data.unit_price ?? 0)
  const computedTotal = parsed.data.total_price != null ? parsed.data.total_price : baseTotal
  const toInsert = {
    ...parsed.data,
    total_price: computedTotal != null ? computedTotal : null,
  }
  const { error } = await supabase.from('change_order_items').insert(toInsert)
  if (error) return { ok: false, error: error.message }
  const to = `/change-orders/${parsed.data.change_order_id}?m=Line%20item%20added&t=success`
  redirect(to)
}

export async function updateLineItemAction(id: string, formData: FormData) {
  const input = {
    description: (formData.get('description') as string) || undefined,
    quantity: formData.get('quantity') as any,
    unit: (formData.get('unit') as string) || undefined,
    unit_price: formData.get('unit_price') as any,
    total_price: formData.get('total_price') as any,
  }
  const schema = lineItemSchema.omit({ change_order_id: true }).partial()
  const parsed = schema.safeParse(input)
  if (!parsed.success) return { ok: false, error: parsed.error.message }
  const supabase = await createClient()
  const computed = {
    ...parsed.data,
  } as any
  if (computed.total_price == null && (computed.quantity != null || computed.unit_price != null)) {
    const q = Number(computed.quantity ?? 0)
    const up = Number(computed.unit_price ?? 0)
    computed.total_price = Number.isFinite(q * up) ? q * up : null
  }
  const { error } = await supabase.from('change_order_items').update(computed).eq('id', id)
  if (error) return { ok: false, error: error.message }
  // change order id unknown here; rely on page revalidation by caller or no-op
  return { ok: true }
}

export async function deleteLineItemAction(id: string, changeOrderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('change_order_items').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  const to = `/change-orders/${changeOrderId}?m=Line%20item%20deleted&t=success`
  redirect(to)
}
