"use client"

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <button className="mt-4 rounded-md border px-3 py-2 text-sm" onClick={reset}>Try again</button>
    </div>
  )
}

