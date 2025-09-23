import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Auth | ARCG",
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      {children}
    </div>
  )
}

