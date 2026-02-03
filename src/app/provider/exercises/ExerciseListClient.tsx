'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { RowHider } from '@/components/ui'
import { ChevronDown, Edit, Trash2, Video, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import type { Exercise, ExerciseMedia } from '../../../../prisma/generated/prisma/client'

interface ExerciseWithMedia extends Exercise {
  media: ExerciseMedia[]
  _count: { prescriptions: number }
}

interface ExerciseListClientProps {
  exercises: ExerciseWithMedia[]
}

export function ExerciseListClient({ exercises }: ExerciseListClientProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {exercises.map((exercise) => (
          <motion.div
            key={exercise.id}
            layout
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <ExerciseCard
              exercise={exercise}
              isExpanded={expandedId === exercise.id}
              onToggle={() =>
                setExpandedId(expandedId === exercise.id ? null : exercise.id)
              }
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

function ExerciseCard({
  exercise,
  isExpanded,
  onToggle,
}: {
  exercise: ExerciseWithMedia
  isExpanded: boolean
  onToggle: () => void
}) {
  const imageCount = exercise.media.filter((m) => m.type === 'IMAGE').length
  const videoCount = exercise.media.filter((m) => m.type === 'VIDEO').length

  return (
    <div className={cn('rounded-xl overflow-hidden', tw.card.default)}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full p-4 flex items-center justify-between',
          tw.hover.bg.subtle,
          'transition-colors'
        )}
      >
        <div className="flex items-center gap-4">
          <div>
            <h3 className={cn('font-medium text-left', tw.text.primary)}>
              {exercise.name}
            </h3>
            <div className={cn('flex items-center gap-3 text-sm', tw.text.muted)}>
              {imageCount > 0 && (
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-4 h-4" />
                  {imageCount}
                </span>
              )}
              {videoCount > 0 && (
                <span className="flex items-center gap-1">
                  <Video className="w-4 h-4" />
                  {videoCount}
                </span>
              )}
              <span>{exercise._count.prescriptions} prescriptions</span>
            </div>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-5 h-5 transition-transform',
            tw.text.muted,
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Expandable content */}
      <RowHider showWhen={isExpanded}>
        <div className={cn('px-4 pb-4 border-t', tw.border.default)}>
          <div className="pt-4">
            {exercise.description && (
              <p className={cn('text-sm mb-4', tw.text.secondary)}>
                {exercise.description}
              </p>
            )}

            {exercise.instructions && (
              <div className="mb-4">
                <h4 className={cn('text-sm font-medium mb-1', tw.text.primary)}>
                  Instructions
                </h4>
                <p className={cn('text-sm whitespace-pre-wrap', tw.text.secondary)}>
                  {exercise.instructions}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                href={`/provider/exercises/${exercise.id}`}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm',
                  tw.btn.secondary
                )}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link>
              <Link
                href={`/provider/exercises/${exercise.id}/prescribe`}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 text-sm',
                  tw.btn.primary
                )}
              >
                Prescribe
              </Link>
            </div>
          </div>
        </div>
      </RowHider>
    </div>
  )
}
