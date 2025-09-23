"use server"

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function saveOcrResultAction(changeOrderId: string, formData: FormData) {
  const image_url = String(formData.get('image_url') || '')
  const ocr_text = String(formData.get('ocr_text') || '')
  const supabase = await createClient()
  const { error } = await supabase.from('change_orders').update({ original_image_url: image_url, ocr_text }).eq('id', changeOrderId)
  if (error) return { ok: false, error: error.message }
  redirect(`/change-orders/${changeOrderId}?m=OCR%20saved&t=success`)
}

