import { getChangeOrderById } from '@/lib/supabase/queries/change-orders'
import { updateChangeOrderAction } from '@/app/(app)/change-orders/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default async function EditChangeOrderPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  const co = await getChangeOrderById(params.id)
  const displayNumber = (value: number | null) =>
    typeof value === 'number' ? value.toString() : ''
  async function action(formData: FormData) {
    'use server'
    await updateChangeOrderAction(params.id, formData)
  }
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Change Order</CardTitle>
        </CardHeader>
        <CardContent>
          <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="co_number">CO Number</Label>
              <Input id="co_number" name="co_number" defaultValue={co.co_number} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={co.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={co.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="justification">Reasons for Changes</Label>
              <Textarea
                id="justification"
                name="justification"
                defaultValue={co.justification ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional_info">Additional Information</Label>
              <Textarea
                id="additional_info"
                name="additional_info"
                defaultValue={co.additional_info ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={co.status ?? 'draft'}>
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
                defaultValue={co.delay_notice_ref ?? ''}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_impact">Cost Impact</Label>
                <Input
                  id="cost_impact"
                  name="cost_impact"
                  type="number"
                  step="0.01"
                  defaultValue={displayNumber(co.cost_impact)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_impact_days">Time Impact (days)</Label>
                <Input
                  id="time_impact_days"
                  name="time_impact_days"
                  type="number"
                  defaultValue={displayNumber(co.time_impact_days)}
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
                    defaultValue={displayNumber(co.labor_hours)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="labor_rate">Hourly Rate ($)</Label>
                  <Input
                    id="labor_rate"
                    name="labor_rate"
                    type="number"
                    step="0.01"
                    defaultValue={displayNumber(co.labor_rate)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="labor_overhead_pct">Overhead %</Label>
                  <Input
                    id="labor_overhead_pct"
                    name="labor_overhead_pct"
                    type="number"
                    step="0.01"
                    defaultValue={displayNumber(co.labor_overhead_pct)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="labor_notes">Labor Notes</Label>
                <Textarea
                  id="labor_notes"
                  name="labor_notes"
                  defaultValue={co.labor_notes ?? undefined}
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
                    defaultValue={displayNumber(co.total_labor_cost)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_overhead_cost">Overhead ($)</Label>
                  <Input
                    id="total_overhead_cost"
                    name="total_overhead_cost"
                    type="number"
                    step="0.01"
                    defaultValue={displayNumber(co.total_overhead_cost)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="total_cost">Total Cost ($)</Label>
                  <Input
                    id="total_cost"
                    name="total_cost"
                    type="number"
                    step="0.01"
                    defaultValue={displayNumber(co.total_cost)}
                  />
                </div>
              </div>
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
