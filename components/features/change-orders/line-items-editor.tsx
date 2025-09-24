import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  addLineItemAction,
  deleteLineItemAction,
  updateLineItemAction,
} from '@/app/(app)/change-orders/actions'

type Item = {
  id: string
  description: string
  quantity: number | null
  unit: string | null
  unit_price: number | null
  total_price: number | null
}

export default function LineItemsEditor({
  changeOrderId,
  initialItems,
}: {
  changeOrderId: string
  initialItems: Item[]
}) {
  function format(n: number | null | undefined) {
    if (n == null) return ''
    return String(n)
  }

  const total = initialItems.reduce((sum, it) => {
    const quantity = typeof it.quantity === 'number' ? it.quantity : 0
    const unitPrice = typeof it.unit_price === 'number' ? it.unit_price : 0
    const lineTotal = typeof it.total_price === 'number' ? it.total_price : quantity * unitPrice
    return sum + lineTotal
  }, 0)

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-foreground/5 text-left">
          <tr>
            <th className="px-3 py-2">Description</th>
            <th className="px-3 py-2">Qty</th>
            <th className="px-3 py-2">Unit</th>
            <th className="px-3 py-2">Unit Price</th>
            <th className="px-3 py-2">Total</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {initialItems.map((it) => (
            <tr key={it.id} className="border-t">
              <td className="px-3 py-2">
                <form
                  action={async (formData: FormData) => {
                    'use server'
                    formData.set('change_order_id', changeOrderId)
                    await updateLineItemAction(it.id, formData)
                  }}
                  className="flex gap-2"
                >
                  <input type="hidden" name="change_order_id" value={changeOrderId} />
                  <Input name="description" defaultValue={it.description} className="w-full" />
                  <Input name="quantity" defaultValue={format(it.quantity)} className="w-20" />
                  <Input name="unit" defaultValue={it.unit ?? ''} className="w-24" />
                  <Input name="unit_price" defaultValue={format(it.unit_price)} className="w-28" />
                  <Input
                    name="total_price"
                    defaultValue={format(it.total_price)}
                    className="w-28"
                  />
                  <Button type="submit">Save</Button>
                </form>
              </td>
              <td colSpan={4} />
              <td className="px-3 py-2 text-right">
                <form
                  action={async () => {
                    'use server'
                    await deleteLineItemAction(it.id, changeOrderId)
                  }}
                >
                  <button className="rounded-md border px-2 py-1">Delete</button>
                </form>
              </td>
            </tr>
          ))}
          <tr className="border-t">
            <td className="px-3 py-2" colSpan={5}>
              <form
                action={async (formData: FormData) => {
                  'use server'
                  formData.set('change_order_id', changeOrderId)
                  await addLineItemAction(formData)
                }}
                className="flex flex-wrap gap-2"
              >
                <Input name="description" placeholder="Description" className="min-w-64" required />
                <Input name="quantity" placeholder="Qty" className="w-24" />
                <Input name="unit" placeholder="Unit" className="w-24" />
                <Input name="unit_price" placeholder="Unit Price" className="w-28" />
                <Input name="total_price" placeholder="Total" className="w-28" />
                <Button type="submit">Add Item</Button>
              </form>
            </td>
            <td />
          </tr>
        </tbody>
        <tfoot>
          <tr className="border-t font-medium">
            <td className="px-3 py-2" colSpan={4}>
              Total
            </td>
            <td className="px-3 py-2">${total.toFixed(2)}</td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
