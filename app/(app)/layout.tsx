import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-6">
        <Sidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}

