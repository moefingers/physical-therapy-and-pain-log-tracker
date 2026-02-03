'use client'

import * as Slider from '@radix-ui/react-slider'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export interface PainSliderProps {
  /** Current pain level (0-10) */
  value: number
  /** Change handler */
  onChange: (value: number) => void
  /** Show min/max labels */
  showLabels?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Pain level slider (0-10 scale)
 *
 * Visual feedback:
 * - 0-3: Green (low pain)
 * - 4-6: Yellow (moderate pain)
 * - 7-10: Red (severe pain)
 */
export function PainSlider({
  value,
  onChange,
  showLabels = true,
  disabled = false,
  className,
}: PainSliderProps) {
  // Get color based on pain level
  const getColor = (level: number) => {
    if (level <= 3) return 'bg-green-500'
    if (level <= 6) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getTrackColor = (level: number) => {
    if (level <= 3) return 'bg-green-500/30'
    if (level <= 6) return 'bg-yellow-500/30'
    return 'bg-red-500/30'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabels && (
        <div className="flex justify-between mb-2">
          <span className={cn('text-sm', tw.text.muted)}>No Pain</span>
          <span className={cn('text-lg font-bold', tw.text.primary)}>
            {value}
          </span>
          <span className={cn('text-sm', tw.text.muted)}>Worst Pain</span>
        </div>
      )}

      <Slider.Root
        className={cn(
          'relative flex items-center select-none touch-none w-full h-5',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        value={[value]}
        onValueChange={([newValue]) => onChange(newValue)}
        min={0}
        max={10}
        step={1}
        disabled={disabled}
      >
        <Slider.Track
          className={cn(
            'relative grow rounded-full h-2',
            getTrackColor(value)
          )}
        >
          <Slider.Range
            className={cn('absolute h-full rounded-full', getColor(value))}
          />
        </Slider.Track>
        <Slider.Thumb
          className={cn(
            'block w-5 h-5 rounded-full shadow-lg',
            getColor(value),
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            tw.focus.ring.default,
            'transition-colors'
          )}
        />
      </Slider.Root>

      {/* Scale markers */}
      <div className="flex justify-between mt-1 px-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <span
            key={num}
            className={cn(
              'text-xs',
              value === num ? tw.text.primary : tw.text.muted
            )}
          >
            {num}
          </span>
        ))}
      </div>
    </div>
  )
}
