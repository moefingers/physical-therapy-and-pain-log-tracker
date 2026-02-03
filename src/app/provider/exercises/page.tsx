import { prisma } from '@/lib/db'
import { syncUser } from '@/lib/sync-user'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ExerciseListClient } from './ExerciseListClient'

export default async function ExercisesPage() {
  const user = await syncUser()
  if (!user) return null

  const exercises = await prisma.exercise.findMany({
    where: { creatorId: user.id },
    include: {
      media: { orderBy: { order: 'asc' } },
      _count: { select: { prescriptions: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className={cn('text-2xl font-bold', tw.text.primary)}>
          Exercise Library
        </h1>
        <Link
          href="/provider/exercises/new"
          className={cn('flex items-center gap-2 px-4 py-2', tw.btn.primary)}
        >
          <Plus className="w-4 h-4" />
          Add Exercise
        </Link>
      </div>

      {exercises.length === 0 ? (
        <div className={cn('p-8 text-center rounded-xl', tw.card.default)}>
          <p className={cn('mb-4', tw.text.secondary)}>
            No exercises in your library yet
          </p>
          <Link
            href="/provider/exercises/new"
            className={cn('inline-flex items-center gap-2 px-4 py-2', tw.btn.primary)}
          >
            <Plus className="w-4 h-4" />
            Create your first exercise
          </Link>
        </div>
      ) : (
        <ExerciseListClient exercises={exercises} />
      )}
    </div>
  )
}
