import * as RadixSelect from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  'aria-label'?: string
}

export function Select({ value, onValueChange, options, placeholder, ...aria }: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        aria-label={aria['aria-label']}
        className={cn(
          'inline-flex items-center justify-between gap-2 rounded-lg bg-ink-800 px-3 py-2 text-sm text-paper-50',
          'ring-1 ring-inset ring-paper-50/15 hover:ring-paper-50/30',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-400',
          'data-[placeholder]:text-paper-100/60 min-w-[10rem]',
        )}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className="z-50 overflow-hidden rounded-lg bg-ink-800 text-paper-50 ring-1 ring-inset ring-paper-50/15 shadow-xl"
          position="popper"
          sideOffset={6}
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className={cn(
                  'relative flex cursor-pointer select-none items-center rounded-md px-3 py-2 pl-8 text-sm',
                  'outline-none data-[highlighted]:bg-paper-50/10',
                )}
              >
                <RadixSelect.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-3.5 w-3.5 text-signal-400" />
                </RadixSelect.ItemIndicator>
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}
