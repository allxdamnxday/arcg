import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordAction } from '@/lib/supabase/actions'
import { ToastFromSearchParams } from '@/components/ui/toast'

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams?: { m?: string; t?: 'success' | 'error' }
}) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>We’ll send a reset link to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <ToastFromSearchParams message={searchParams?.m} type={searchParams?.t ?? null} />
          <form
            action={async (formData: FormData) => {
              'use server'
              await resetPasswordAction(formData)
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
