import AuthForm from "@/components/auth/auth-form"
import { registerAction } from "@/lib/supabase/actions"
import Link from "next/link"

export default function RegisterPage() {
  // Wrap the register action to validate password confirmation
  async function action(formData: FormData) {
    'use server'
    const password = String(formData.get('password') || '')
    const confirm = String(formData.get('confirm') || '')
    if (password !== confirm) {
      // Do not submit if mismatch; later we can add client-side feedback
      return
    }
    await registerAction(formData)
  }

  return (
    <div className="space-y-4">
      <AuthForm
        title="Create account"
        description="Start managing change orders"
        action={action}
        submitLabel="Create account"
        showConfirm
      />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? {" "}
        <Link href="/login" className="underline">Sign in</Link>
      </p>
    </div>
  )
}
