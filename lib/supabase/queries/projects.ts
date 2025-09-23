import { createClient } from '@/lib/supabase/server'
import type { Tables, TablesInsert, TablesUpdate } from '@/types/database'
import { projectCreateSchema, projectUpdateSchema, type ProjectCreateInput, type ProjectUpdateInput } from '@/lib/validations/project'

export async function getProjects(opts?: { q?: string; sort?: 'created_at'|'project_number'|'name'; dir?: 'asc'|'desc' }) {
  const supabase = await createClient()
  let query = supabase
    .from('projects')
    .select('*')
    .order(opts?.sort ?? 'created_at', { ascending: (opts?.dir ?? 'desc') === 'asc' })
  if (opts?.q && opts.q.trim()) {
    const q = `%${opts.q.trim()}%`
    query = query.or(
      `project_number.ilike.${q},name.ilike.${q},client_name.ilike.${q}`
    )
  }
  const { data, error } = await query
  if (error) throw error
  return data as Tables<'projects'>[]
}

export async function createProject(input: ProjectCreateInput) {
  const parsed = projectCreateSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert(parsed as TablesInsert<'projects'>)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'projects'>
}

export async function updateProject(id: string, input: ProjectUpdateInput) {
  const parsed = projectUpdateSchema.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .update(parsed as TablesUpdate<'projects'>)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw error
  return data as Tables<'projects'>
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getProjectById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Tables<'projects'>
}

export async function getProjectChangeOrders(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('change_orders')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Tables<'change_orders'>[]
}
