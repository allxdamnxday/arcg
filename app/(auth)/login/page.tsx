import AuthForm from '@/components/auth/auth-form'
import { loginAction } from '@/lib/supabase/actions'
import Link from 'next/link'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  async function action(formData: FormData) {
    'use server'
    await loginAction(formData)
  }
  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <AuthForm
        title="Sign in"
        description="Access your ARCG account"
        action={action}
        submitLabel="Sign in"
      />
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{' '}
        <Link href="/register" className="underline">
          Create one
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        <Link href="/reset-password" className="underline">
          Forgot your password?
        </Link>
      </p>
    </div>
  )
}
