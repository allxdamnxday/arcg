import { listDelayNotices } from '@/lib/supabase/queries/delay-notices'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default async function DelayNoticesListPage({ searchParams }: { searchParams: { q?: string; status?: string; m?: string; t?: string } }) {
  const q = searchParams?.q ?? ''
  const status = (searchParams?.status as 'draft'|'sent'|'acknowledged'|undefined) ?? undefined
  const notices = await listDelayNotices({ q, status })
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t as any} />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Delay Notices</h1>
        <Button asChild><Link href="/delay-notices/new">New Delay Notice</Link></Button>
      </div>
      <form action="/delay-notices" className="flex flex-wrap gap-2">
        <Input name="q" placeholder="Search..." defaultValue={q} />
        <Select name="status" defaultValue={status ?? ''}>
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="acknowledged">Acknowledged</option>
        </Select>
        <Button type="submit">Filter</Button>
      </form>
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-foreground/5 text-left">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Incident Date</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((n) => (
              <tr key={n.id} className="border-t">
                <td className="px-3 py-2"><Link className="underline" href={`/delay-notices/${n.id}`}>{n.title}</Link></td>
                <td className="px-3 py-2">{n.incident_date}</td>
                <td className="px-3 py-2">{n.status}</td>
              </tr>
            ))}
            {notices.length === 0 && (
              <tr><td className="px-3 py-4 text-muted-foreground" colSpan={3}>No delay notices</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

