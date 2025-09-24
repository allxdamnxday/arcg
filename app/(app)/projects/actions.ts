'use server'

import { redirect } from 'next/navigation'
import { projectCreateSchema, projectUpdateSchema } from '@/lib/validations/project'
import { createClient } from '@/lib/supabase/server'

export async function createProjectAction(formData: FormData) {
  const input = {
    project_number: String(formData.get('project_number') || ''),
    name: String(formData.get('name') || ''),
    client_name: (formData.get('client_name') as string) || undefined,
    address: (formData.get('address') as string) || undefined,
  }
  const parsed = projectCreateSchema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.flatten().formErrors.join(', ') || 'Invalid project data'
    )
    redirect(`/projects/new?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('projects').insert(parsed.data)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/projects/new?m=${message}&t=error`)
  }
  redirect('/projects?m=Project%20created&t=success')
}

export async function updateProjectAction(id: string, formData: FormData) {
  const input = {
    project_number: (formData.get('project_number') as string) || undefined,
    name: (formData.get('name') as string) || undefined,
    client_name: (formData.get('client_name') as string) || undefined,
    address: (formData.get('address') as string) || undefined,
  }
  const parsed = projectUpdateSchema.safeParse(input)
  if (!parsed.success) {
    const message = encodeURIComponent(
      parsed.error.flatten().formErrors.join(', ') || 'Invalid project data'
    )
    redirect(`/projects/${id}?m=${message}&t=error`)
  }
  const supabase = await createClient()
  const { error } = await supabase.from('projects').update(parsed.data).eq('id', id)
  if (error) {
    const message = encodeURIComponent(error.message)
    redirect(`/projects/${id}?m=${message}&t=error`)
  }
  redirect(`/projects/${id}?m=Project%20updated&t=success`)
}

export async function deleteProjectAction(id: string, redirectTo?: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }
  if (redirectTo) redirect(redirectTo)
  return { ok: true }
}
