import { createChangeOrderAction } from '@/app/(app)/change-orders/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/server'
import { Label } from '@/components/ui/label'
import { ToastFromSearchParams } from '@/components/ui/toast'

type DelayPrefill = {
  project_id?: string
  title?: string
  description?: string
  delay_notice_ref?: string
  justification?: string
  additional_info?: string
  labor_notes?: string
  time_impact_days?: number
}

export default async function NewChangeOrderPage({
  searchParams,
}: {
  searchParams?: { from_notice?: string; m?: string; t?: 'success' | 'error' }
}) {
  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, project_number, name')
    .order('project_number')
  let defaults: DelayPrefill = {}
  if (searchParams?.from_notice) {
    const { data: notice } = await supabase
      .from('delay_notices')
      .select('project_id,title,description,incident_date,time_impact_days_estimate')
      .eq('id', searchParams.from_notice)
      .single()
    if (notice) {
      defaults = {
        project_id: notice.project_id,
        title: notice.title,
        description: notice.description,
        delay_notice_ref: notice.title ?? undefined,
        justification: notice.description ?? undefined,
        additional_info: notice.incident_date
          ? `Incident Date: ${notice.incident_date}`
          : undefined,
        labor_notes: notice.description ?? undefined,
        time_impact_days: notice.time_impact_days_estimate ?? undefined,
      }
    }
  }
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>New Change Order</CardTitle>
        </CardHeader>
        <CardContent>
          <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
          <form
            action={async (formData: FormData) => {
              'use server'
              await createChangeOrderAction(formData)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="project_id">Project</Label>
              <Select
                id="project_id"
                name="project_id"
                required
                defaultValue={defaults.project_id ?? ''}
              >
                <option value="">Select a project</option>
                {(projects || []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.project_number} — {p.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="co_number">CO Number</Label>
              <Input id="co_number" name="co_number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required defaultValue={defaults.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                defaultValue={defaults.description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justification">Reasons for Changes</Label>
              <Textarea
                id="justification"
                name="justification"
                placeholder="Explain why the work is required"
                defaultValue={defaults.justification}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional_info">Additional Information</Label>
              <Textarea
                id="additional_info"
                name="additional_info"
                placeholder="Capture any context or site conditions"
                defaultValue={defaults.additional_info}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delay_notice_ref">Related Delay Notice</Label>
              <Input
                id="delay_notice_ref"
                name="delay_notice_ref"
                defaultValue={defaults.delay_notice_ref ?? ''}
                placeholder="e.g. Delay Notice #15"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_impact">Cost Impact</Label>
                <Input id="cost_impact" name="cost_impact" type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_impact_days">Time Impact (days)</Label>
                <Input
                  id="time_impact_days"
                  name="time_impact_days"
                  type="number"
                  defaultValue={
                    defaults.time_impact_days != null
                      ? defaults.time_impact_days.toString()
                      : undefined
                  }
                />
              </div>
            </div>
            <div className="space-y-4 rounded-md border p-4">
              <h2 className="text-sm font-semibold">Labor Summary</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="labor_hours">Total Man-Hours</Label>
                  <Input
                    id="labor_hours"
                    name="labor_hours"
                    type="number"
                    step="0.1"
                    placeholder="e.g. 40"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="labor_rate">Hourly Rate ($)</Label>
                  <Input
                    id="labor_rate"
                    name="labor_rate"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 120"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="labor_overhead_pct">Overhead %</Label>
                  <Input
                    id="labor_overhead_pct"
                    name="labor_overhead_pct"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 0.15"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="labor_notes">Labor Notes</Label>
                <Textarea
                  id="labor_notes"
                  name="labor_notes"
                  placeholder="Breakdown of crews or tasks"
                  defaultValue={defaults.labor_notes}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="total_labor_cost">Labor Subtotal ($)</Label>
                  <Input
                    id="total_labor_cost"
                    name="total_labor_cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 4800"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_overhead_cost">Overhead ($)</Label>
                  <Input
                    id="total_overhead_cost"
                    name="total_overhead_cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 720"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_cost">Total Cost ($)</Label>
                  <Input
                    id="total_cost"
                    name="total_cost"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 5520"
                  />
                </div>
              </div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
