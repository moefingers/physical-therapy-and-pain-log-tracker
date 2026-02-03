'use client'

import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Error state */
  hasError?: boolean
  /** Label text */
  label?: string
  /** Helper/error text */
  helperText?: string
}

/**
 * Input component with label and helper text support
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, label, helperText, id, ...props }, ref) => {
    const inputId = id || props.name

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
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2',
            hasError ? tw.input.error : tw.input.default,
            className
          )}
          {...props}
        />
        {helperText && (
          <p
            className={cn(
              'text-sm mt-1.5',
              hasError ? tw.text.error : tw.text.muted
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
