import * as RadixToast from '@radix-ui/react-toast'
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastMessage {
  id: number
  title: string
  description?: string
  tone: 'success' | 'error'
}

interface ToastContextValue {
  notify: (toast: Omit<ToastMessage, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const notify = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now()
    setToasts((current) => [...current, { ...toast, id }])
  }, [])

  const dismiss = (id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ notify }}>
      <RadixToast.Provider swipeDirection="right" duration={4000}>
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            onOpenChange={(open) => !open && dismiss(toast.id)}
            className={cn(
              'flex items-start gap-3 rounded-lg bg-ink-800 p-4 text-paper-50 shadow-xl ring-1 ring-inset',
              'data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-2',
              toast.tone === 'success' ? 'ring-moss-500/40' : 'ring-alert-500/40',
            )}
          >
            {toast.tone === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss-400" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-alert-500" />
            )}
            <div className="text-sm">
              <RadixToast.Title className="font-medium">{toast.title}</RadixToast.Title>
              {toast.description ? (
                <RadixToast.Description className="mt-0.5 text-paper-100/70">
                  {toast.description}
                </RadixToast.Description>
              ) : null}
            </div>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-80 flex-col gap-2" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}
