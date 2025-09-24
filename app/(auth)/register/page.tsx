import AuthForm from '@/components/auth/auth-form'
import { registerAction } from '@/lib/supabase/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default function RegisterPage({
  searchParams,
}: {
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  // Wrap the register action to validate password confirmation
  async function action(formData: FormData) {
    'use server'
    const password = String(formData.get('password') || '')
    const confirm = String(formData.get('confirm') || '')
    if (password !== confirm) {
      const message = encodeURIComponent('Passwords do not match')
      redirect(`/register?m=${message}&t=error`)
    }
    await registerAction(formData)
  }

  return (
    <div className="space-y-4">
      <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
      <AuthForm
        title="Create account"
        description="Start managing change orders"
        action={action}
        submitLabel="Create account"
        showConfirm
      />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
