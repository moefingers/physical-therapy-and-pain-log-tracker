'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { Minus, Plus } from 'lucide-react'

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  /** Current value */
  value: number
  /** Change handler */
  onChange: (value: number) => void
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Label text */
  label?: string
  /** Helper text */
  helperText?: string
}

/**
 * Number input with increment/decrement buttons
 */
export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      value,
      onChange,
      min = 0,
      max = 999,
      step = 1,
      label,
      helperText,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name

    const increment = () => {
      const newValue = Math.min(max, value + step)
      onChange(newValue)
    }

    const decrement = () => {
      const newValue = Math.max(min, value - step)
      onChange(newValue)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10)
      if (!isNaN(newValue)) {
        onChange(Math.min(max, Math.max(min, newValue)))
      }
    }

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn('block text-sm font-medium mb-1.5', tw.text.secondary)}
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrement}
            disabled={disabled || value <= min}
            className={cn(
              'p-2 rounded-lg transition-colors',
              tw.bg.card,
              tw.border.default,
              'border',
              tw.hover.bg.subtle,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            ref={ref}
            id={inputId}
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            className={cn(
              'w-20 px-3 py-2 text-center',
              tw.input.default,
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={increment}
            disabled={disabled || value >= max}
            className={cn(
              'p-2 rounded-lg transition-colors',
              tw.bg.card,
              tw.border.default,
              'border',
              tw.hover.bg.subtle,
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {helperText && (
          <p className={cn('text-sm mt-1.5', tw.text.muted)}>{helperText}</p>
        )}
      </div>
    )
  }
)

NumberInput.displayName = 'NumberInput'
