import { z } from 'zod'

export const projectCreateSchema = z.object({
  project_number: z.string().min(1, 'Project number is required'),
  name: z.string().min(1, 'Project name is required'),
  client_name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

export const projectUpdateSchema = projectCreateSchema.partial()

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

