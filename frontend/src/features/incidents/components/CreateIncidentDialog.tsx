import { useState, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea } from '@/components/ui/Field'
import { useCreateIncident } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { createIncidentSchema, incidentTypes } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { NativeSelect } from '@/components/ui/NativeSelect'
import { Plus } from 'lucide-react'

const typeLabels: Record<string, string> = {
  OVERFLOW: 'Desborde',
  DAMAGE: 'Daño',
  LITTERING: 'Basural / suciedad',
  OTHER: 'Otro',
}

export function CreateIncidentDialog() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: zones = [] } = useZones()
  const createIncident = useCreateIncident()
  const { notify } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const raw = Object.fromEntries(formData.entries())

    const result = createIncidentSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    createIncident.mutate(result.data, {
      onSuccess: () => {
        notify({ tone: 'success', title: 'Incidente reportado', description: 'Se agregó a la lista como REPORTED.' })
        setOpen(false)
        event.currentTarget.reset()
      },
      onError: (error) => {
        notify({ tone: 'error', title: 'No se pudo reportar el incidente', description: error.message })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Reportar incidente"
      description="Registrá un problema detectado en la vía pública."
      trigger={
        <Button>
          <Plus className="h-4 w-4" />
          Reportar incidente
        </Button>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Tipo" htmlFor="type" error={errors.type}>
          <NativeSelect name="type" options={incidentTypes} labels={typeLabels} />
        </Field>

        <Field label="Descripción" htmlFor="description" error={errors.description}>
          <Textarea id="description" name="description" placeholder="Contenedor desbordado en Av. Corrientes" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Latitud" htmlFor="lat" error={errors.lat}>
            <Input id="lat" name="lat" type="number" step="any" placeholder="-34.6037" />
          </Field>
          <Field label="Longitud" htmlFor="lng" error={errors.lng}>
            <Input id="lng" name="lng" type="number" step="any" placeholder="-58.3816" />
          </Field>
        </div>

        <Field label="Zona" htmlFor="zoneId" error={errors.zoneId}>
          <NativeSelect
            name="zoneId"
            options={zones.map((z) => z.id)}
            labels={Object.fromEntries(zones.map((z) => [z.id, z.name]))}
          />
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit" disabled={createIncident.isPending}>
            {createIncident.isPending ? 'Reportando…' : 'Reportar'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

