'use client'

import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Error state */
  hasError?: boolean
  /** Label text */
  label?: string
  /** Helper/error text */
  helperText?: string
  /** Options to display */
  options: { value: string; label: string }[]
  /** Placeholder option */
  placeholder?: string
}

/**
 * Select component with label and helper text support
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      hasError,
      label,
      helperText,
      id,
      options,
      placeholder,
      ...props
    },
    ref
  ) => {
    const selectId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn('block text-sm font-medium mb-1.5', tw.text.secondary)}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'w-full px-3 py-2 appearance-none cursor-pointer',
            hasError ? tw.input.error : tw.input.default,
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select'
