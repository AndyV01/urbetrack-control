import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  trigger?: ReactNode
}

export function Dialog({ open, onOpenChange, title, description, children, trigger }: DialogProps) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <RadixDialog.Trigger asChild>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <RadixDialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2
            rounded-xl bg-ink-900 p-6 text-paper-50 ring-1 ring-inset ring-paper-50/10 shadow-2xl
            focus:outline-none"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <RadixDialog.Title className="font-display text-lg font-semibold">
                {title}
              </RadixDialog.Title>
              {description ? (
                <RadixDialog.Description className="mt-1 text-sm text-paper-100/70">
                  {description}
                </RadixDialog.Description>
              ) : null}
            </div>
            <RadixDialog.Close
              className="rounded-md p-1 text-paper-100/60 hover:bg-paper-50/10 hover:text-paper-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-400"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </RadixDialog.Close>
          </div>
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
