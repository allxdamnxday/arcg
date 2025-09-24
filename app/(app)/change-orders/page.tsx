import Link from 'next/link'
import { getChangeOrders } from '@/lib/supabase/queries/change-orders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ToastFromSearchParams } from '@/components/ui/toast'
import { StatusBadge } from '@/components/features/change-orders/status-badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { deleteChangeOrderAction } from '@/app/(app)/change-orders/actions'

type ChangeOrderStatus = 'draft' | 'pending' | 'approved'

export default async function ChangeOrdersListPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    status?: string
    sort?: string
    dir?: string
    m?: string
    t?: 'success' | 'error'
  }
}) {
  const q = searchParams?.q ?? ''
  const status = (searchParams?.status as 'draft' | 'pending' | 'approved' | undefined) ?? undefined
  const sort =
    (searchParams?.sort as 'created_at' | 'co_number' | 'status' | undefined) ?? 'created_at'
  const dir = (searchParams?.dir as 'asc' | 'desc' | undefined) ?? 'desc'
  const cos = await getChangeOrders({ q, status, sort, dir })
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Change Orders</h1>
        <Button asChild>
          <Link href="/change-orders/new">New Change Order</Link>
        </Button>
      </div>

      <form action="/change-orders" className="flex flex-wrap gap-2">
        <Input name="q" placeholder="Search COs..." defaultValue={q} className="min-w-64" />
        <Select name="status" defaultValue={status ?? ''}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </Select>
        <Select name="sort" defaultValue={sort}>
          <option value="created_at">Created</option>
          <option value="co_number">CO #</option>
          <option value="status">Status</option>
        </Select>
        <Select name="dir" defaultValue={dir}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </Select>
        <Button type="submit">Filter</Button>
      </form>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left">
            <tr>
              <th className="px-3 py-2">CO #</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Project</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cos.map((co) => (
              <tr key={co.id} className="border-t">
                <td className="px-3 py-2">
                  {co.id ? (
                    <Link className="underline" href={`/change-orders/${co.id}`}>
                      {co.co_number}
                    </Link>
                  ) : (
                    <span>{co.co_number}</span>
                  )}
                </td>
                <td className="px-3 py-2">{co.title}</td>
                <td className="px-3 py-2">{co.project_number}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={co.status as ChangeOrderStatus | null} />
                </td>
                <td className="px-3 py-2 text-right">
                  {co.id ? (
                    <ConfirmDialog
                      title="Delete change order?"
                      description="This will permanently delete the change order."
                      confirmLabel="Delete"
                      action={async () => {
                        'use server'
                        await deleteChangeOrderAction(
                          co.id as string,
                          '/change-orders?m=Change%20order%20deleted&t=success'
                        )
                      }}
                      trigger={
                        <button className="rounded-md border px-2 py-1 text-xs">Delete</button>
                      }
                    />
                  ) : null}
                </td>
              </tr>
            ))}
            {cos.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-muted-foreground" colSpan={5}>
                  No change orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
