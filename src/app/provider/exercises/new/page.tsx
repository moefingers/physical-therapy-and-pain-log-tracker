'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { Button, Input, Textarea } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createExercise } from '../actions'

export default function NewExercisePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const instructions = formData.get('instructions') as string

    const result = await createExercise({ name, description, instructions })

    if (result.success && result.exerciseId) {
      // Redirect to exercise edit page to add media
      router.push(`/provider/exercises/${result.exerciseId}`)
    } else {
      setError(result.error || 'Failed to create exercise')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        href="/provider/exercises"
        className={cn(
          'inline-flex items-center gap-2 mb-6',
          tw.text.secondary,
          tw.hover.text.primary
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>

      <h1 className={cn('text-2xl font-bold mb-6', tw.text.primary)}>
        Create New Exercise
      </h1>

      <form onSubmit={handleSubmit} className={cn('p-6', tw.card.default)}>
        {error && (
          <div
            className={cn(
              'p-3 rounded-lg mb-4',
              tw.bg.errorMuted,
              tw.text.error
            )}
          >
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Input
            name="name"
            label="Exercise Name"
            placeholder="e.g., Hamstring Stretch"
            required
          />

          <Textarea
            name="description"
            label="Description"
            placeholder="Brief description of the exercise"
          />

          <Textarea
            name="instructions"
            label="Instructions"
            placeholder="Step-by-step instructions for performing the exercise"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Link href="/provider/exercises">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>
            Create & Add Media
          </Button>
        </div>
      </form>
    </div>
  )
}
