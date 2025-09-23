import { getChangeOrderById } from '@/lib/supabase/queries/change-orders'
import { updateChangeOrderAction } from '@/app/(app)/change-orders/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default async function EditChangeOrderPage({ params }: { params: { id: string } }) {
  const co = await getChangeOrderById(params.id)
  async function action(formData: FormData) {
    'use server'
    const { updateChangeOrderAction } = await import('@/app/(app)/change-orders/actions')
    await updateChangeOrderAction(params.id, formData)
  }
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Change Order</CardTitle>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={co.status ?? 'draft'}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_impact">Cost Impact</Label>
                <Input id="cost_impact" name="cost_impact" type="number" step="0.01" defaultValue={co.cost_impact ?? undefined} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_impact_days">Time Impact (days)</Label>
                <Input id="time_impact_days" name="time_impact_days" type="number" defaultValue={co.time_impact_days ?? undefined} />
              </div>
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
