import { createProjectAction } from '@/app/(app)/projects/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default function NewProjectPage({
  searchParams,
}: {
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>New Project</CardTitle>
        </CardHeader>
        <CardContent>
          <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
          <form
            action={async (formData: FormData) => {
              'use server'
              await createProjectAction(formData)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="project_number">Project number</Label>
              <Input id="project_number" name="project_number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client_name">Client</Label>
              <Input id="client_name" name="client_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" name="address" />
            </div>
            <Button type="submit">Create</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
