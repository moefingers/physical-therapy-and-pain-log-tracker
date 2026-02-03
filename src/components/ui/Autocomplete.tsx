'use client'

import { useState, useRef, useEffect, forwardRef } from 'react'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface AutocompleteProps {
  /** Current value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Suggestions to show */
  suggestions: string[]
  /** Placeholder text */
  placeholder?: string
  /** Label text */
  label?: string
  /** Helper text */
  helperText?: string
  /** Allow custom values not in suggestions */
  allowCustom?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Autocomplete input with dropdown suggestions
 *
 * Used for activity and body region fields in pain logs
 * Populated from previous entries with ability to add new
 */
export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      value,
      onChange,
      suggestions,
      placeholder,
      label,
      helperText,
      allowCustom = true,
      disabled = false,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    // Filter suggestions based on input
    useEffect(() => {
      if (value.trim() === '') {
        setFilteredSuggestions(suggestions)
      } else {
        const filtered = suggestions.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        )
        setFilteredSuggestions(filtered)
      }
    }, [value, suggestions])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value)
      setIsOpen(true)
    }

    const handleSuggestionClick = (suggestion: string) => {
      onChange(suggestion)
      setIsOpen(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    return (
      <div ref={containerRef} className={cn('relative w-full', className)}>
        {label && (
          <label
            className={cn('block text-sm font-medium mb-1.5', tw.text.secondary)}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn('w-full px-3 py-2', tw.input.default)}
        />

        {/* Dropdown */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div
            className={cn(
              'absolute z-50 w-full mt-1 max-h-48 overflow-auto',
              'rounded-lg shadow-lg',
              tw.bg.elevated,
              tw.border.default,
              'border'
            )}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={cn(
                  'w-full px-3 py-2 text-left',
                  tw.text.primary,
                  tw.hover.bg.subtle,
                  'transition-colors'
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Show "Add new" option when no matches */}
        {isOpen &&
          allowCustom &&
          value.trim() !== '' &&
          filteredSuggestions.length === 0 && (
            <div
              className={cn(
                'absolute z-50 w-full mt-1',
                'rounded-lg shadow-lg',
                tw.bg.elevated,
                tw.border.default,
                'border'
              )}
            >
              <div
                className={cn('px-3 py-2 text-sm italic', tw.text.muted)}
              >
                Press Enter to add &quot;{value}&quot;
              </div>
            </div>
          )}

        {helperText && (
          <p className={cn('text-sm mt-1.5', tw.text.muted)}>{helperText}</p>
        )}
      </div>
    )
  }
)

Autocomplete.displayName = 'Autocomplete'
