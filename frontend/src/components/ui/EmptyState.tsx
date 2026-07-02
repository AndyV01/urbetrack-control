import type { ReactNode } from 'react'

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-ink-900 px-6 py-14 text-center ring-1 ring-inset ring-paper-50/10">
      <div className="text-paper-100/30">{icon}</div>
      <p className="font-display text-sm font-semibold text-paper-50">{title}</p>
      <p className="max-w-sm text-sm text-paper-100/50">{description}</p>
    </div>
  )
}
