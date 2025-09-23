import { getProjectById, getProjectChangeOrders } from '@/lib/supabase/queries/projects'
import { deleteProjectAction } from '@/app/(app)/projects/actions'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import Link from 'next/link'

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, cos] = await Promise.all([
    getProjectById(params.id),
    getProjectChangeOrders(params.id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-sm text-muted-foreground">{project.project_number} • {project.client_name}</p>
        <div className="mt-3">
          <ConfirmDialog
            title="Delete project?"
            description="This will remove the project and related change orders."
            confirmLabel="Delete"
            action={async () => {
              'use server'
              const { deleteProjectAction } = await import('@/app/(app)/projects/actions')
              await deleteProjectAction(project.id, '/projects?m=Project%20deleted&t=success')
            }}
            trigger={<button className="rounded-md border px-3 py-1.5 text-sm">Delete project</button>}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Change Orders</h2>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5 text-left">
              <tr>
                <th className="px-3 py-2">CO #</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {cos.map((co) => (
                <tr key={co.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link className="underline" href={`/change-orders/${co.id}`}>{co.co_number}</Link>
                  </td>
                  <td className="px-3 py-2">{co.title}</td>
                  <td className="px-3 py-2">{co.status}</td>
                </tr>
              ))}
              {cos.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-muted-foreground" colSpan={3}>No change orders</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
