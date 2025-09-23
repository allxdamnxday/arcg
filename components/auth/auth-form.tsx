import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type AuthFormProps = {
  title: string
  description?: string
  action: (formData: FormData) => Promise<void>
  submitLabel: string
  showPassword?: boolean
  showConfirm?: boolean
}

export default function AuthForm({ title, description, action, submitLabel, showPassword = true, showConfirm = false }: AuthFormProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description ? <CardDescription>{description}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </div>
            {showPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
              </div>
            )}
            {showConfirm && (
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" name="confirm" type="password" required autoComplete="new-password" />
              </div>
            )}
            <Button type="submit" className="w-full">{submitLabel}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
