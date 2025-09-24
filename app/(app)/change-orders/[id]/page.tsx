import { getChangeOrderById } from '@/lib/supabase/queries/change-orders'
import Link from 'next/link'
import { getLineItemsByChangeOrder } from '@/lib/supabase/queries/line-items'
import LineItemsEditor from '@/components/features/change-orders/line-items-editor'
import { StatusBadge } from '@/components/features/change-orders/status-badge'
import { ChangeOrderPdfButton } from '@/components/features/change-orders/pdf-download-button'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { ToastFromSearchParams } from '@/components/ui/toast'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { deleteChangeOrderAction } from '@/app/(app)/change-orders/actions'
const OcrUploader = dynamic(() => import('@/components/features/ocr/ocr-uploader'), { ssr: false })

type ToastType = 'success' | 'error'

export default async function ChangeOrderDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams?: { m?: string; t?: ToastType }
}) {
  const [co, items] = await Promise.all([
    getChangeOrderById(params.id),
    getLineItemsByChangeOrder(params.id),
  ])
  const status = (co.status ?? null) as 'draft' | 'pending' | 'approved' | null
  const formatNumber = (value: number | null, options?: Intl.NumberFormatOptions) => {
    if (typeof value !== 'number') return null
    return new Intl.NumberFormat('en-US', options ?? { style: 'currency', currency: 'USD' }).format(
      value
    )
  }
  const formatCurrency = (value?: number | null) =>
    formatNumber(value ?? null, { style: 'currency', currency: 'USD' }) ?? '—'
  const lineItemsTotal = items.reduce((sum, item) => {
    const explicit = typeof item.total_price === 'number' ? item.total_price : null
    if (explicit != null) return sum + explicit
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0
    const unitPrice = typeof item.unit_price === 'number' ? item.unit_price : 0
    return sum + quantity * unitPrice
  }, 0)
  const laborSubtotal =
    co.total_labor_cost ??
    (typeof co.labor_hours === 'number' && typeof co.labor_rate === 'number'
      ? co.labor_hours * co.labor_rate
      : null)
  const laborOverhead =
    co.total_overhead_cost ??
    (laborSubtotal != null && typeof co.labor_overhead_pct === 'number'
      ? laborSubtotal * co.labor_overhead_pct
      : null)
  const computedGrandTotal =
    co.total_cost ??
    co.cost_impact ??
    (lineItemsTotal || 0) + (laborSubtotal ?? 0) + (laborOverhead ?? 0)
  const showFinancialSummary =
    items.length > 0 ||
    laborSubtotal != null ||
    laborOverhead != null ||
    co.total_cost != null ||
    co.cost_impact != null
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{co.title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <span>{co.co_number}</span>
            <StatusBadge status={status} />
          </p>
          {co.delay_notice_ref ? (
            <p className="text-xs text-muted-foreground">
              Delay Notice Reference: {co.delay_notice_ref}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-start gap-4">
          <ChangeOrderPdfButton changeOrderId={co.id} coNumber={co.co_number} />
          <Link href={`/change-orders/${co.id}/edit`} className="underline">
            Edit
          </Link>
          <ConfirmDialog
            title="Delete change order?"
            description="This will permanently delete the change order."
            confirmLabel="Delete"
            action={async () => {
              'use server'
              await deleteChangeOrderAction(
                co.id,
                '/change-orders?m=Change%20order%20deleted&t=success'
              )
            }}
            trigger={<button className="rounded-md border px-3 py-1.5 text-sm">Delete</button>}
          />
        </div>
      </div>
      <div className="rounded-md border p-4">
        <p className="text-sm whitespace-pre-wrap">{co.description}</p>
      </div>

      {(co.justification || co.additional_info) && (
        <div className="grid gap-4 rounded-md border p-4 sm:grid-cols-2">
          {co.justification ? (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">Reasons for Changes</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm">{co.justification}</p>
            </div>
          ) : null}
          {co.additional_info ? (
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground">
                Additional Information
              </h2>
              <p className="mt-1 whitespace-pre-wrap text-sm">{co.additional_info}</p>
            </div>
          ) : null}
        </div>
      )}

      {(co.total_cost || co.labor_notes || co.labor_hours || co.labor_rate) && (
        <div className="space-y-3 rounded-md border p-4">
          <h2 className="text-lg font-semibold">Labor Summary</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {co.labor_hours != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Total Man-Hours</div>
                <div className="text-sm font-medium">{co.labor_hours}</div>
              </div>
            ) : null}
            {co.labor_rate != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Hourly Rate</div>
                <div className="text-sm font-medium">
                  {formatNumber(co.labor_rate, { style: 'currency', currency: 'USD' })}
                </div>
              </div>
            ) : null}
            {co.labor_overhead_pct != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Overhead %</div>
                <div className="text-sm font-medium">
                  {(co.labor_overhead_pct * 100).toFixed(2)}%
                </div>
              </div>
            ) : null}
          </div>
          {co.labor_notes ? <p className="whitespace-pre-wrap text-sm">{co.labor_notes}</p> : null}
          <div className="grid gap-4 sm:grid-cols-3">
            {co.total_labor_cost != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Labor Subtotal</div>
                <div className="text-sm font-medium">{formatNumber(co.total_labor_cost)}</div>
              </div>
            ) : null}
            {co.total_overhead_cost != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Overhead</div>
                <div className="text-sm font-medium">{formatNumber(co.total_overhead_cost)}</div>
              </div>
            ) : null}
            {co.total_cost != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Total Change Order</div>
                <div className="text-sm font-medium">{formatNumber(co.total_cost)}</div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {showFinancialSummary && (
        <div className="space-y-3 rounded-md border p-4">
          <h2 className="text-lg font-semibold">Financial Summary</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {items.length > 0 ? (
              <div>
                <div className="text-sm text-muted-foreground">Line Items</div>
                <div className="text-sm font-medium">{formatCurrency(lineItemsTotal)}</div>
              </div>
            ) : null}
            {laborSubtotal != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Labor Subtotal</div>
                <div className="text-sm font-medium">{formatCurrency(laborSubtotal)}</div>
              </div>
            ) : null}
            {laborOverhead != null ? (
              <div>
                <div className="text-sm text-muted-foreground">Overhead</div>
                <div className="text-sm font-medium">{formatCurrency(laborOverhead)}</div>
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">Recorded Total</div>
            <div className="text-sm font-semibold">{formatCurrency(computedGrandTotal)}</div>
          </div>
        </div>
      )}

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
            <Image
              src={co.original_image_url}
              alt="original"
              width={128}
              height={128}
              className="mt-1 h-32 w-32 rounded object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}
