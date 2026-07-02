import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-signal-400">{eyebrow}</p>
        <h1 className="mt-1 font-display text-2xl font-semibold text-paper-50">{title}</h1>
        {description ? <p className="mt-1 max-w-xl text-sm text-paper-100/60">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
