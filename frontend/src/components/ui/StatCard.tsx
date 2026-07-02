import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  icon,
  tone = 'neutral',
  hint,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  tone?: 'neutral' | 'warning' | 'danger' | 'ok'
  hint?: string
}) {
  const toneRing = {
    neutral: 'ring-paper-50/10',
    warning: 'ring-signal-500/30',
    danger: 'ring-alert-500/30',
    ok: 'ring-moss-500/30',
  }[tone]

  return (
    <div className={cn('flex flex-col gap-3 rounded-xl bg-ink-900 p-5 ring-1 ring-inset', toneRing)}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-widest text-paper-100/50">{label}</p>
        <div className="text-paper-100/40">{icon}</div>
      </div>
      <p className="font-display text-3xl font-semibold text-paper-50">{value}</p>
      {hint ? <p className="text-xs text-paper-100/50">{hint}</p> : null}
    </div>
  )
}
