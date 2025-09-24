import Link from 'next/link'
import { getProjects } from '@/lib/supabase/queries/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToastFromSearchParams } from '@/components/ui/toast'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { deleteProjectAction } from '@/app/(app)/projects/actions'

export default async function ProjectsListPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; dir?: string; m?: string; t?: 'success' | 'error' }
}) {
  const q = searchParams?.q ?? ''
  const sort =
    (searchParams?.sort as 'created_at' | 'project_number' | 'name' | undefined) ?? 'created_at'
  const dir = (searchParams?.dir as 'asc' | 'desc' | undefined) ?? 'desc'
  const projects = await getProjects({ q, sort, dir })
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button asChild>
          <Link href="/projects/new">New Project</Link>
        </Button>
      </div>

      <form action="/projects" className="flex flex-wrap gap-2">
        <Input name="q" placeholder="Search projects..." defaultValue={q} />
        <select name="sort" defaultValue={sort} className="h-10 rounded-md border px-3 text-sm">
          <option value="created_at">Created</option>
          <option value="project_number">Project #</option>
          <option value="name">Name</option>
        </select>
        <select name="dir" defaultValue={dir} className="h-10 rounded-md border px-3 text-sm">
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
        <Button type="submit">Apply</Button>
      </form>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left">
            <tr>
              <th className="px-3 py-2">Project #</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Client</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">
                  <Link href={`/projects/${p.id}`} className="underline">
                    {p.project_number}
                  </Link>
                </td>
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2">{p.client_name}</td>
                <td className="px-3 py-2 text-right">
                  <ConfirmDialog
                    title="Delete project?"
                    description="This will remove the project and related change orders."
                    confirmLabel="Delete"
                    action={async () => {
                      'use server'
                      await deleteProjectAction(p.id, '/projects?m=Project%20deleted&t=success')
                    }}
                    trigger={
                      <button className="rounded-md border px-2 py-1 text-xs">Delete</button>
                    }
                  />
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-muted-foreground" colSpan={4}>
                  No projects
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
