import * as RadixLabel from '@radix-ui/react-label'
import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <RadixLabel.Root htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-paper-100/70">
        {label}
      </RadixLabel.Root>
      {children}
      {error ? <p className="text-xs text-alert-500">{error}</p> : null}
    </div>
  )
}

const fieldClasses =
  'rounded-lg bg-ink-800 px-3 py-2 text-sm text-paper-50 placeholder:text-paper-100/40 ' +
  'ring-1 ring-inset ring-paper-50/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldClasses, className)} {...props} />
  ),
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldClasses, 'min-h-20 resize-y', className)} {...props} />
  ),
)
Textarea.displayName = 'Textarea'
