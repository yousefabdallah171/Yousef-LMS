import type { ReactNode } from 'react'

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="rounded-2xl border border-ghost bg-surface-high p-6 shadow-ambient">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
          Yousef LMS
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">{subtitle}</p>
      </header>
      {children}
    </section>
  )
}
