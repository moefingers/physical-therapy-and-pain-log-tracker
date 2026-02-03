'use client'

import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  hasError?: boolean
  /** Label text */
  label?: string
  /** Helper/error text */
  helperText?: string
}

/**
 * Textarea component with label and helper text support
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, label, helperText, id, ...props }, ref) => {
    const textareaId = id || props.name

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn('block text-sm font-medium mb-1.5', tw.text.secondary)}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-3 py-2 min-h-[100px] resize-y',
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

Textarea.displayName = 'Textarea'
