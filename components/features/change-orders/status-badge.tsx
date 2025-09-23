import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status }: { status?: 'draft' | 'pending' | 'approved' | null }) {
  if (!status) return null
  if (status === 'approved') return <Badge variant="success">Approved</Badge>
  if (status === 'pending') return <Badge variant="warning">Pending</Badge>
  return <Badge variant="secondary">Draft</Badge>
}

