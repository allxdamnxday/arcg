"use client"

import { createClient } from '@/lib/supabase/client'

export async function uploadImage(file: File, pathPrefix = 'uploads') {
  const supabase = createClient()
  const bucket = 'co-images'
  const ext = file.name.split('.').pop() || 'png'
  const filePath = `${pathPrefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return data.publicUrl
}

