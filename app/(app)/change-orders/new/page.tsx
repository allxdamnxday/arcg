import { createChangeOrderAction } from '@/app/(app)/change-orders/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/server'
import { Label } from '@/components/ui/label'

export default async function NewChangeOrderPage({ searchParams }: { searchParams?: { from_notice?: string } }) {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('id, project_number, name').order('project_number')
  let defaults: { project_id?: string; title?: string; description?: string } = {}
  if (searchParams?.from_notice) {
    const { data: notice } = await supabase.from('delay_notices').select('project_id,title,description').eq('id', searchParams.from_notice).single()
    if (notice) {
      defaults = { project_id: notice.project_id, title: notice.title, description: notice.description }
    }
  }
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>New Change Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={async (formData: FormData) => { 'use server'; await createChangeOrderAction(formData) }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project</Label>
              <Select id="project_id" name="project_id" required defaultValue={defaults.project_id ?? ''}>
                <option value="">Select a project</option>
                {(projects || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.project_number} — {p.name}</option>
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
              <Textarea id="description" name="description" required defaultValue={defaults.description} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost_impact">Cost Impact</Label>
                <Input id="cost_impact" name="cost_impact" type="number" step="0.01" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time_impact_days">Time Impact (days)</Label>
                <Input id="time_impact_days" name="time_impact_days" type="number" />
              </div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
