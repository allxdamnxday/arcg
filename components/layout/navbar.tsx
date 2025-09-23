import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/dashboard" className="font-semibold">ARCG</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/projects" className="hover:underline">Projects</Link>
          <Link href="/change-orders" className="hover:underline">Change Orders</Link>
          <Link href="/delay-notices" className="hover:underline">Delay Notices</Link>
        </nav>
      </div>
    </header>
  )
}
