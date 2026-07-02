import { useState, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { NativeSelect } from '@/components/ui/NativeSelect'
import { useCreateVehicle } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { createVehicleSchema, vehicleTypes } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { Plus } from 'lucide-react'

const typeLabels: Record<string, string> = {
  TRUCK: 'Camión',
  VAN: 'Camioneta',
  PICKUP: 'Pickup',
}

export function CreateVehicleDialog() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: zones = [] } = useZones()
  const createVehicle = useCreateVehicle()
  const { notify } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const raw = Object.fromEntries(formData.entries())

    const result = createVehicleSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    createVehicle.mutate(result.data, {
      onSuccess: () => {
        notify({ tone: 'success', title: 'Vehículo agregado', description: `${result.data.plate} se sumó a la flota.` })
        setOpen(false)
        event.currentTarget.reset()
      },
      onError: (error) => {
        notify({ tone: 'error', title: 'No se pudo crear el vehículo', description: error.message })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Nuevo vehículo"
      description="Sumá un camión, camioneta o pickup a la flota de una zona."
      trigger={
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo vehículo
        </Button>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Patente" htmlFor="plate" error={errors.plate}>
          <Input id="plate" name="plate" placeholder="AB123CD" />
        </Field>

        <Field label="Tipo" htmlFor="type" error={errors.type}>
          <NativeSelect name="type" options={vehicleTypes} labels={typeLabels} />
        </Field>

        <Field label="Capacidad (kg)" htmlFor="capacity" error={errors.capacity}>
          <Input id="capacity" name="capacity" type="number" min={1} placeholder="5000" />
        </Field>

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
          <Button type="submit" disabled={createVehicle.isPending}>
            {createVehicle.isPending ? 'Creando…' : 'Crear vehículo'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
