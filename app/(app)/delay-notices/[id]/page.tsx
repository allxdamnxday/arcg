import { getDelayNotice } from '@/lib/supabase/queries/delay-notices'
import { createClient } from '@/lib/supabase/server'
import {
  markDelayNoticeSentAction,
  sendDelayNoticeEmailAction,
} from '@/app/(app)/delay-notices/actions'
import Link from 'next/link'
import { ToastFromSearchParams } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'

export default async function DelayNoticeDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  const notice = await getDelayNotice(params.id)
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('project_number,name')
    .eq('id', notice.project_id)
    .single()
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{notice.title}</h1>
          <p className="text-sm text-muted-foreground">
            {project?.project_number} • {project?.name}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form
            action={async () => {
              'use server'
              await sendDelayNoticeEmailAction(notice.id)
            }}
          >
            <Button type="submit">Send Email</Button>
          </form>
          <form
            action={async () => {
              'use server'
              await markDelayNoticeSentAction(notice.id)
            }}
          >
            <Button type="submit" variant="outline">
              Mark Sent
            </Button>
          </form>
          <Link className="underline" href={`/change-orders/new?from_notice=${notice.id}`}>
            Create Change Order
          </Link>
        </div>
      </div>
      <div className="rounded-md border p-4">
        <div className="mb-2 text-sm text-muted-foreground">
          Incident: {notice.incident_date} • Reported: {notice.reported_date}
        </div>
        <p className="whitespace-pre-wrap text-sm">{notice.description}</p>
      </div>
      <div className="text-xs text-muted-foreground">
        Status: {notice.status}{' '}
        {notice.emailed_at ? `• Sent ${new Date(notice.emailed_at).toLocaleString()}` : ''}
      </div>
    </div>
  )
}
