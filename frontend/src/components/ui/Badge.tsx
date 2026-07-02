import { cn } from '@/lib/utils'

type BadgeTone = 'ok' | 'warning' | 'danger' | 'neutral' | 'info'

const toneStyles: Record<BadgeTone, string> = {
  ok: 'bg-moss-500/15 text-moss-400 ring-1 ring-inset ring-moss-500/40',
  warning: 'bg-signal-500/15 text-signal-400 ring-1 ring-inset ring-signal-500/40',
  danger: 'bg-alert-500/15 text-alert-500 ring-1 ring-inset ring-alert-500/40',
  neutral: 'bg-paper-50/10 text-paper-100 ring-1 ring-inset ring-paper-50/20',
  info: 'bg-sky-500/15 text-sky-400 ring-1 ring-inset ring-sky-500/40',
}

// Mapeos de dominio: cada status del backend a un tono visual coherente.
const assetStatusTone: Record<string, BadgeTone> = {
  OK: 'ok',
  FULL: 'warning',
  DAMAGED: 'danger',
  OUT_OF_SERVICE: 'neutral',
}

const incidentStatusTone: Record<string, BadgeTone> = {
  REPORTED: 'danger',
  IN_PROGRESS: 'warning',
  RESOLVED: 'ok',
}

const vehicleStatusTone: Record<string, BadgeTone> = {
  ACTIVE: 'ok',
  MAINTENANCE: 'warning',
  OUT_OF_SERVICE: 'neutral',
}

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide',
        toneStyles[tone],
      )}
    >
      {children}
    </span>
  )
}

export function AssetStatusBadge({ status }: { status: string }) {
  return <Badge tone={assetStatusTone[status] ?? 'neutral'}>{status.replace(/_/g, ' ')}</Badge>
}

export function IncidentStatusBadge({ status }: { status: string }) {
  return <Badge tone={incidentStatusTone[status] ?? 'neutral'}>{status.replace(/_/g, ' ')}</Badge>
}

export function VehicleStatusBadge({ status }: { status: string }) {
  return <Badge tone={vehicleStatusTone[status] ?? 'neutral'}>{status.replace(/_/g, ' ')}</Badge>
}
