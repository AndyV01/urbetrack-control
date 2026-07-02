import { NavLink, type NavLinkProps } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LayoutGrid, MapPinned, TriangleAlert, Truck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useZones } from '@/features/zones/hooks'
import { useZoneFilterStore } from '@/store/useZoneFilterStore'

const navItems = [
  { to: '/', label: 'Panel', icon: LayoutGrid, end: true },
  { to: '/assets', label: 'Assets', icon: MapPinned },
  { to: '/incidents', label: 'Incidentes', icon: TriangleAlert },
  { to: '/vehicles', label: 'Flota', icon: Truck },
] satisfies Array<{ to: string; label: string; icon: typeof LayoutGrid; end?: boolean }>

function NavItem({ to, end, children }: { to: string; end?: NavLinkProps['end']; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-signal-500/15 text-signal-400 ring-1 ring-inset ring-signal-500/30'
            : 'text-paper-100/70 hover:bg-paper-50/5 hover:text-paper-50',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const { data: zones } = useZones()
  const activeZoneId = useZoneFilterStore((s) => s.activeZoneId)
  const setActiveZoneId = useZoneFilterStore((s) => s.setActiveZoneId)

  return (
    <div className="min-h-screen bg-ink-950 lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="flex flex-col gap-8 border-b border-paper-50/10 px-5 py-6 lg:border-b-0 lg:border-r lg:min-h-screen">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-500 font-display text-sm font-bold text-ink-950">
            U
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-paper-50">Urbetrack</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-paper-100/50">Control</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavItem key={to} to={to} end={end}>
              <Icon className="h-4 w-4" />
              {label}
            </NavItem>
          ))}
        </nav>

        <div className="flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-paper-100/50">
            Zona activa
          </p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveZoneId(null)}
              className={cn(
                'flex items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                activeZoneId === null
                  ? 'bg-paper-50/10 text-paper-50'
                  : 'text-paper-100/60 hover:bg-paper-50/5 hover:text-paper-50',
              )}
            >
              Todas las zonas
            </button>
            {zones?.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setActiveZoneId(zone.id)}
                className={cn(
                  'flex items-center justify-between rounded-md px-3 py-1.5 text-left text-sm transition-colors',
                  activeZoneId === zone.id
                    ? 'bg-paper-50/10 text-paper-50'
                    : 'text-paper-100/60 hover:bg-paper-50/5 hover:text-paper-50',
                )}
              >
                {zone.name}
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    activeZoneId === zone.id ? 'bg-signal-400' : 'bg-paper-50/20',
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className="px-5 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
      </main>
    </div>
  )
}
