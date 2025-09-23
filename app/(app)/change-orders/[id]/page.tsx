import { getChangeOrderById } from '@/lib/supabase/queries/change-orders'
import Link from 'next/link'
import { getLineItemsByChangeOrder } from '@/lib/supabase/queries/line-items'
import LineItemsEditor from '@/components/features/change-orders/line-items-editor'
import { StatusBadge } from '@/components/features/change-orders/status-badge'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ToastFromSearchParams } from '@/components/ui/toast'
import dynamic from 'next/dynamic'
const OcrUploader = dynamic(() => import('@/components/features/ocr/ocr-uploader'), { ssr: false })

export default async function ChangeOrderDetailPage({ params, searchParams }: { params: { id: string }, searchParams?: { m?: string; t?: string } }) {
  const [co, items] = await Promise.all([
    getChangeOrderById(params.id),
    getLineItemsByChangeOrder(params.id),
  ])
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t as any} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{co.title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{co.co_number}</span>
            <StatusBadge status={co.status as any} />
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/change-orders/${co.id}/edit`} className="underline">Edit</Link>
          <ConfirmDialog
            title="Delete change order?"
            description="This will permanently delete the change order."
            confirmLabel="Delete"
            action={async () => {
              'use server'
              const { deleteChangeOrderAction } = await import('@/app/(app)/change-orders/actions')
              await deleteChangeOrderAction(co.id, '/change-orders?m=Change%20order%20deleted&t=success')
            }}
            trigger={<button className="rounded-md border px-3 py-1.5 text-sm">Delete</button>}
          />
        </div>
      </div>
      <div className="rounded-md border p-4">
        <p className="text-sm whitespace-pre-wrap">{co.description}</p>
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">Line Items</h2>
        <LineItemsEditor changeOrderId={co.id} initialItems={items} />
      </div>

      <div>
        <h2 className="mb-2 text-lg font-semibold">OCR</h2>
        <OcrUploader changeOrderId={co.id} />
        {co.original_image_url && (
          <div className="mt-3">
            <div className="text-sm font-medium">Saved Image</div>
            <img src={co.original_image_url} alt="original" className="mt-1 h-32 rounded object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
