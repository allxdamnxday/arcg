import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { StatusBadge } from '@/components/features/change-orders/status-badge'

export default async function DashboardPage() {
  const supabase = await createClient()
  const [
    { count: projectsCount },
    { count: coCount },
    { count: pendingCount },
    { data: recentCos },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('change_orders').select('*', { count: 'exact', head: true }),
    supabase
      .from('change_orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('change_order_summary')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{projectsCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Change Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{coCount ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending COs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{pendingCount ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Recent Change Orders</h2>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-foreground/5 text-left">
              <tr>
                <th className="px-3 py-2">CO #</th>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Project</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recentCos || []).map((co) => (
                <tr key={co.id} className="border-t">
                  <td className="px-3 py-2">
                    <Link href={`/change-orders/${co.id}`} className="underline">
                      {co.co_number}
                    </Link>
                  </td>
                  <td className="px-3 py-2">{co.title}</td>
                  <td className="px-3 py-2">{co.project_number}</td>
                  <td className="px-3 py-2">
                    <StatusBadge status={co.status as 'draft' | 'pending' | 'approved' | null} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
