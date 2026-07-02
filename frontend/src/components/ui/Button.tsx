import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-signal-500 text-ink-950 hover:bg-signal-400 focus-visible:outline-signal-400 font-semibold',
  secondary:
    'bg-ink-800 text-paper-50 hover:bg-ink-800/70 ring-1 ring-inset ring-paper-50/15 focus-visible:outline-paper-50/40',
  ghost:
    'bg-transparent text-paper-100 hover:bg-paper-50/10 focus-visible:outline-paper-50/40',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          variantStyles[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
