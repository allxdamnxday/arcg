import { cn } from '@/lib/utils'

export function Badge({ children, className = '', variant = 'default' }: { children: React.ReactNode; className?: string; variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' }) {
  const styles = {
    default: 'bg-foreground text-background',
    secondary: 'bg-foreground/10 text-foreground',
    outline: 'border border-foreground/20 text-foreground',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
  } as const
  return (
    <span className={cn('inline-flex items-center rounded px-2 py-0.5 text-xs font-medium', styles[variant], className)}>
      {children}
    </span>
  )
}

