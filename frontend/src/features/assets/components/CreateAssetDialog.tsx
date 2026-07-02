import { useState, type FormEvent } from 'react'
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Field, Input } from '@/components/ui/Field'
import { useCreateAsset } from '../hooks'
import { useZones } from '@/features/zones/hooks'
import { assetStatuses, assetTypes, createAssetSchema } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { NativeSelect } from '@/components/ui/NativeSelect'
import { Plus } from 'lucide-react'

const typeLabels: Record<string, string> = {
  BIN: 'Papelera',
  CONTAINER: 'Contenedor',
  BENCH: 'Banco',
}

const statusLabels: Record<string, string> = {
  OK: 'OK',
  DAMAGED: 'Dañado',
  FULL: 'Lleno',
  OUT_OF_SERVICE: 'Fuera de servicio',
}

export function CreateAssetDialog() {
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { data: zones = [] } = useZones()
  const createAsset = useCreateAsset()
  const { notify } = useToast()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const raw = Object.fromEntries(formData.entries())

    const result = createAssetSchema.safeParse(raw)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        fieldErrors[String(issue.path[0])] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    createAsset.mutate(result.data, {
      onSuccess: () => {
        notify({ tone: 'success', title: 'Asset creado', description: `${result.data.address} agregado correctamente.` })
        setOpen(false)
        event.currentTarget.reset()
      },
      onError: (error) => {
        notify({ tone: 'error', title: 'No se pudo crear el asset', description: error.message })
      },
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      title="Nuevo asset urbano"
      description="Registrá una papelera, contenedor o banco en el mapa de la ciudad."
      trigger={
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo asset
        </Button>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Field label="Tipo" htmlFor="type" error={errors.type}>
          <NativeSelect name="type" options={assetTypes} labels={typeLabels} />
        </Field>

        <Field label="Estado" htmlFor="status" error={errors.status}>
          <NativeSelect name="status" options={assetStatuses} labels={statusLabels} defaultValue="OK" />
        </Field>

        <Field label="Dirección" htmlFor="address" error={errors.address}>
          <Input id="address" name="address" placeholder="Av. Corrientes 1234" />
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
          <Button type="submit" disabled={createAsset.isPending}>
            {createAsset.isPending ? 'Creando…' : 'Crear asset'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

