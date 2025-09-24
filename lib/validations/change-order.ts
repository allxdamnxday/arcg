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
  justification: z.string().optional().nullable(),
  additional_info: z.string().optional().nullable(),
  labor_notes: z.string().optional().nullable(),
  labor_hours: z.coerce.number().nonnegative().optional().nullable(),
  labor_rate: z.coerce.number().nonnegative().optional().nullable(),
  labor_overhead_pct: z.coerce.number().nonnegative().optional().nullable(),
  total_labor_cost: z.coerce.number().nonnegative().optional().nullable(),
  total_overhead_cost: z.coerce.number().nonnegative().optional().nullable(),
  total_cost: z.coerce.number().nonnegative().optional().nullable(),
  delay_notice_ref: z.string().optional().nullable(),
})

export const changeOrderUpdateSchema = changeOrderCreateSchema.partial()

export type ChangeOrderCreateInput = z.infer<typeof changeOrderCreateSchema>
export type ChangeOrderUpdateInput = z.infer<typeof changeOrderUpdateSchema>
