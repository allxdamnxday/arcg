'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import {
  changeOrderCreateSchema,
  changeOrderUpdateSchema,
  changeOrderStatusEnum,
} from '@/lib/validations/change-order'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

type ChangeOrderStatus = z.infer<typeof changeOrderStatusEnum>

const toNullableNumber = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string' || value.trim() === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const toStatus = (value: FormDataEntryValue | null): ChangeOrderStatus | undefined => {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  return changeOrderStatusEnum.options.includes(value as ChangeOrderStatus)
    ? (value as ChangeOrderStatus)
    : undefined
}

const toNullableText = (value: FormDataEntryValue | null) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

export async function createChangeOrderAction(formData: FormData) {
  const projectIdValue = formData.get('project_id')
  const coNumberValue = formData.get('co_number')
  const titleValue = formData.get('title')
  const descriptionValue = formData.get('description')
  const input = {
    project_id: typeof projectIdValue === 'string' ? projectIdValue : '',
    co_number: typeof coNumberValue === 'string' ? coNumberValue : '',
    title: typeof titleValue === 'string' ? titleValue : '',
    description: typeof descriptionValue === 'string' ? descriptionValue : '',
    cost_impact: toNullableNumber(formData.get('cost_impact')),
    time_impact_days: toNullableNumber(formData.get('time_impact_days')),
    status: toStatus(formData.get('status')),
    justification: toNullableText(formData.get('justification')),
    additional_info: toNullableText(formData.get('additional_info')),
    labor_notes: toNullableText(formData.get('labor_notes')),
    labor_hours: toNullableNumber(formData.get('labor_hours')),
    labor_rate: toNullableNumber(formData.get('labor_rate')),
    labor_overhead_pct: toNullableNumber(formData.get('labor_overhead_pct')),
    total_labor_cost: toNullableNumber(formData.get('total_labor_cost')),
    total_overhead_cost: toNullableNumber(formData.get('total_overhead_cost')),
    total_cost: toNullableNumber(formData.get('total_cost')),
    delay_notice_ref: toNullableText(formData.get('delay_notice_ref')),
  }
  const parsed = changeOrderCreateSchema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.flatten().formErrors.join(', ') || 'Invalid change order data'
    )
    redirect(`/change-orders/new?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .insert(parsed.data)
    .select('id')
    .single()
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/change-orders/new?m=${message}&t=error`)
  }
  redirect(`/change-orders/${data!.id}?m=Change%20order%20created&t=success`)
}

export async function updateChangeOrderAction(id: string, formData: FormData) {
  const input = {
    project_id:
      typeof formData.get('project_id') === 'string'
        ? String(formData.get('project_id'))
        : undefined,
    co_number:
      typeof formData.get('co_number') === 'string' ? String(formData.get('co_number')) : undefined,
    title: typeof formData.get('title') === 'string' ? String(formData.get('title')) : undefined,
    description:
      typeof formData.get('description') === 'string'
        ? String(formData.get('description'))
        : undefined,
    cost_impact: toNullableNumber(formData.get('cost_impact')),
    time_impact_days: toNullableNumber(formData.get('time_impact_days')),
    status: toStatus(formData.get('status')),
    justification: toNullableText(formData.get('justification')),
    additional_info: toNullableText(formData.get('additional_info')),
    labor_notes: toNullableText(formData.get('labor_notes')),
    labor_hours: toNullableNumber(formData.get('labor_hours')),
    labor_rate: toNullableNumber(formData.get('labor_rate')),
    labor_overhead_pct: toNullableNumber(formData.get('labor_overhead_pct')),
    total_labor_cost: toNullableNumber(formData.get('total_labor_cost')),
    total_overhead_cost: toNullableNumber(formData.get('total_overhead_cost')),
    total_cost: toNullableNumber(formData.get('total_cost')),
    delay_notice_ref: toNullableText(formData.get('delay_notice_ref')),
  }
  const parsed = changeOrderUpdateSchema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.flatten().formErrors.join(', ') || 'Invalid change order data'
    )
    redirect(`/change-orders/${id}/edit?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('change_orders').update(parsed.data).eq('id', id)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/change-orders/${id}/edit?m=${message}&t=error`)
  }
  redirect(`/change-orders/${id}?m=Change%20order%20updated&t=success`)
}

export async function updateChangeOrderStatusAction(
  id: string,
  status: 'draft' | 'pending' | 'approved'
) {
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
    quantity: toNullableNumber(formData.get('quantity')),
    unit: (() => {
      const value = formData.get('unit')
      return typeof value === 'string' && value.trim() !== '' ? value : null
    })(),
    unit_price: toNullableNumber(formData.get('unit_price')),
    total_price: toNullableNumber(formData.get('total_price')),
  }
  const parsed = lineItemSchema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(parsed.error.message)
    redirect(`/change-orders/${input.change_order_id}?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const baseTotal = (parsed.data.quantity ?? 0) * (parsed.data.unit_price ?? 0)
  const computedTotal = parsed.data.total_price != null ? parsed.data.total_price : baseTotal
  const toInsert = {
    ...parsed.data,
    total_price: computedTotal != null ? computedTotal : null,
  }
  const { error } = await supabase.from('change_order_items').insert(toInsert)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/change-orders/${parsed.data.change_order_id}?m=${message}&t=error`)
  }
  const to = `/change-orders/${parsed.data.change_order_id}?m=Line%20item%20added&t=success`
  redirect(to)
}

export async function updateLineItemAction(id: string, formData: FormData) {
  const input = {
    description:
      typeof formData.get('description') === 'string'
        ? String(formData.get('description'))
        : undefined,
    quantity: toNullableNumber(formData.get('quantity')) ?? undefined,
    unit: (() => {
      const value = formData.get('unit')
      return typeof value === 'string' && value.trim() !== '' ? value : undefined
    })(),
    unit_price: toNullableNumber(formData.get('unit_price')) ?? undefined,
    total_price: toNullableNumber(formData.get('total_price')) ?? undefined,
  }
  const changeOrderId = String(formData.get('change_order_id') || '')
  const schema = lineItemSchema.omit({ change_order_id: true }).partial()
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(parsed.error.message)
    redirect(`/change-orders/${changeOrderId}?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const computed: z.infer<typeof schema> = {
    ...parsed.data,
  }
  if (computed.total_price == null && (computed.quantity != null || computed.unit_price != null)) {
    const q = Number(computed.quantity ?? 0)
    const up = Number(computed.unit_price ?? 0)
    computed.total_price = Number.isFinite(q * up) ? q * up : null
  }
  const { error } = await supabase.from('change_order_items').update(computed).eq('id', id)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/change-orders/${changeOrderId}?m=${message}&t=error`)
  }
  if (changeOrderId) {
    revalidatePath(`/change-orders/${changeOrderId}`)
  }
  return { ok: true }
}

export async function deleteLineItemAction(id: string, changeOrderId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('change_order_items').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  const to = `/change-orders/${changeOrderId}?m=Line%20item%20deleted&t=success`
  redirect(to)
}
