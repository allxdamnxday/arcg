import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) redirect('/dashboard')

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-semibold">ARC Glazing Change Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Sign in to manage projects, delay notices, and change orders.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/login" className="rounded-md border px-4 py-2 text-sm">Sign in</Link>
        <Link href="/register" className="rounded-md border px-4 py-2 text-sm">Create account</Link>
      </div>
    </div>
  )
}
