import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

export default function AppLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <LoadingSkeleton className="h-6 w-40" />
      <LoadingSkeleton className="h-28 w-full" />
      <LoadingSkeleton className="h-28 w-full" />
    </div>
  )
}

