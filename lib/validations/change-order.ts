import { z } from 'zod'

export const changeOrderStatusEnum = z.enum(['draft', 'pending', 'approved'])

export const changeOrderCreateSchema = z.object({
  project_id: z.string().uuid('Invalid project id'),
  co_number: z.string().min(1, 'CO number is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  cost_impact: z.coerce.number().nonnegative().optional().nullable(),
  time_impact_days: z.coerce.number().int().optional().nullable(),
  status: changeOrderStatusEnum.optional(),
})

export const changeOrderUpdateSchema = changeOrderCreateSchema.partial()

export type ChangeOrderCreateInput = z.infer<typeof changeOrderCreateSchema>
export type ChangeOrderUpdateInput = z.infer<typeof changeOrderUpdateSchema>

