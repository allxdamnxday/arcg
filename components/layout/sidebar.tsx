import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Sidebar({ current }: { current?: string }) {
  const items = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/projects', label: 'Projects' },
    { href: '/change-orders', label: 'Change Orders' },
  ]
  return (
    <aside className="hidden w-56 shrink-0 border-r md:block">
      <div className="p-4">
        <div className="text-xs font-semibold text-muted-foreground mb-2">Menu</div>
        <ul className="space-y-1">
          {items.map((it) => (
            <li key={it.href}>
              <Link href={it.href} className={cn('block rounded px-3 py-2 text-sm hover:bg-accent', current === it.href && 'bg-accent')}>
                {it.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

