import { createDelayNoticeAction } from '@/app/(app)/delay-notices/actions'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export default async function NewDelayNoticePage() {
  const supabase = await createClient()
  const { data: projects } = await supabase.from('projects').select('id, project_number, name').order('project_number')
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>New Delay Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={async (fd: FormData) => { 'use server'; await createDelayNoticeAction(fd) }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project_id">Project</Label>
              <Select id="project_id" name="project_id" required>
                <option value="">Select a project</option>
                {(projects || []).map((p) => (
                  <option key={p.id} value={p.id}>{p.project_number} — {p.name}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incident_date">Incident Date</Label>
                <Input id="incident_date" name="incident_date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reported_date">Reported Date</Label>
                <Input id="reported_date" name="reported_date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time_impact_days_estimate">Est. Time Impact (days)</Label>
                <Input id="time_impact_days_estimate" name="time_impact_days_estimate" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients (comma separated emails)</Label>
                <Input id="recipients" name="recipients" placeholder="pm@gc.com, supt@gc.com" />
              </div>
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

