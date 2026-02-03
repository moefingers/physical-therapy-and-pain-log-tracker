'use client'

import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  /** Whether the associated field is required */
  required?: boolean
}

/**
 * Label component for form fields
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium', tw.text.secondary, className)}
        {...props}
      >
        {children}
        {required && <span className={cn('ml-1', tw.text.error)}>*</span>}
      </label>
    )
  }
)

Label.displayName = 'Label'
