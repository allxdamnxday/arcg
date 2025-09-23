export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-foreground/10 ${className}`} />
}

