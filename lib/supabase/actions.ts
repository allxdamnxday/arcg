'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    const message = encodeURIComponent(error.message)
    const to = `/login?m=${message}&t=error`
    return redirect(to)
  }
  return redirect('/dashboard')
}

export async function registerAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) {
    const message = encodeURIComponent(error.message)
    return redirect(`/register?m=${message}&t=error`)
  }
  if (data.session) {
    return redirect('/dashboard')
  }
  const m = encodeURIComponent('Check your email to confirm your account')
  return redirect(`/login?m=${m}&t=success`)
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function resetPasswordAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim()
  const supabase = await createClient()

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    'http://localhost:3000'
  const redirectTo = `${origin}/reset-password` // You can update to a dedicated callback page later

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
  if (error) {
    const message = encodeURIComponent(error.message)
    return redirect(`/reset-password?m=${message}&t=error`)
  }
  const m = encodeURIComponent('Password reset email sent')
  return redirect(`/reset-password?m=${m}&t=success`)
}
