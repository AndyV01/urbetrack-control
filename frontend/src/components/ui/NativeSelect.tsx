/**
 * Radix Select no es un control de formulario nativo: no participa de
 * FormData. Para los formularios de alta (que leen valores con FormData en
 * vez de mantener estado controlado por campo) usamos este <select> nativo,
 * estilizado para verse consistente con el resto del sistema de diseño.
 * El Select de Radix (components/ui/Select.tsx) se reserva para filtros
 * controlados fuera de formularios.
 */
export function NativeSelect({
  name,
  options,
  labels,
  defaultValue,
}: {
  name: string
  options: readonly string[]
  labels: Record<string, string>
  defaultValue?: string
}) {
  return (
    <select
      id={name}
      name={name}
      defaultValue={defaultValue ?? ''}
      className="rounded-lg bg-ink-800 px-3 py-2 text-sm text-paper-50 ring-1 ring-inset ring-paper-50/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
    >
      <option value="" disabled>
        Elegí una opción
      </option>
      {options.map((value) => (
        <option key={value} value={value}>
          {labels[value] ?? value}
        </option>
      ))}
    </select>
  )
}
