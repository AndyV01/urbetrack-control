import { Button } from '@/components/ui/Button'

interface PaginationProps {
  page: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalItems,
  pageSize = 10,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize)

  if (totalPages <= 1) return null

  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-paper-100/60">
        Mostrando <span className="font-medium">{from}</span>–
        <span className="font-medium">{to}</span> de{' '}
        <span className="font-medium">{totalItems}</span> resultados
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>

        <span className="text-sm text-paper-100/70">
          Página {page} de {totalPages}
        </span>

        <Button
          variant="ghost"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Siguiente
        </Button>
      </div>
    </div>
  )
}