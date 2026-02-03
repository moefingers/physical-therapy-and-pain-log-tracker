'use server'

import { prisma } from '@/lib/db'
import { requireRole } from '@/lib/sync-user'
import { compressImage } from '@/lib/image-compress'
import { extractYouTubeId } from '@/lib/youtube'
import { revalidatePath } from 'next/cache'

// ============================================
// TYPES
// ============================================

export interface CreateExerciseInput {
  name: string
  description?: string
  instructions?: string
}

export interface AddMediaInput {
  exerciseId: string
  type: 'IMAGE' | 'VIDEO'
  url?: string
  imageData?: string // Base64 encoded image
}

// ============================================
// EXERCISE ACTIONS
// ============================================

export async function createExercise(input: CreateExerciseInput) {
  const user = await requireRole('PROVIDER')

  if (!input.name.trim()) {
    return { success: false, error: 'Exercise name is required' }
  }

  try {
    const exercise = await prisma.exercise.create({
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        instructions: input.instructions?.trim() || null,
        creatorId: user.id,
      },
    })

    revalidatePath('/provider/exercises')

    return { success: true, exerciseId: exercise.id }
  } catch (error) {
    console.error('Failed to create exercise:', error)
    return { success: false, error: 'Failed to create exercise' }
  }
}

export async function updateExercise(
  exerciseId: string,
  input: CreateExerciseInput
) {
  const user = await requireRole('PROVIDER')

  // Verify ownership
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, creatorId: user.id },
  })

  if (!exercise) {
    return { success: false, error: 'Exercise not found' }
  }

  try {
    await prisma.exercise.update({
      where: { id: exerciseId },
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        instructions: input.instructions?.trim() || null,
      },
    })

    revalidatePath('/provider/exercises')
    revalidatePath(`/provider/exercises/${exerciseId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to update exercise:', error)
    return { success: false, error: 'Failed to update exercise' }
  }
}

export async function deleteExercise(exerciseId: string) {
  const user = await requireRole('PROVIDER')

  // Verify ownership
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, creatorId: user.id },
  })

  if (!exercise) {
    return { success: false, error: 'Exercise not found' }
  }

  try {
    await prisma.exercise.delete({ where: { id: exerciseId } })
    revalidatePath('/provider/exercises')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete exercise:', error)
    return { success: false, error: 'Failed to delete exercise' }
  }
}

// ============================================
// MEDIA ACTIONS
// ============================================

export async function addMediaByUrl(exerciseId: string, url: string) {
  const user = await requireRole('PROVIDER')

  // Verify ownership
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, creatorId: user.id },
  })

  if (!exercise) {
    return { success: false, error: 'Exercise not found' }
  }

  // Determine media type
  const youtubeId = extractYouTubeId(url)
  const isVideo =
    youtubeId ||
    url.match(/\.(mp4|webm|mov)$/i) ||
    url.includes('youtube.com') ||
    url.includes('youtu.be')

  try {
    // Get current max order
    const maxOrder = await prisma.exerciseMedia.aggregate({
      where: { exerciseId },
      _max: { order: true },
    })

    await prisma.exerciseMedia.create({
      data: {
        exerciseId,
        type: isVideo ? 'VIDEO' : 'IMAGE',
        url,
        youtubeId,
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    revalidatePath(`/provider/exercises/${exerciseId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to add media:', error)
    return { success: false, error: 'Failed to add media' }
  }
}

export async function addMediaByUpload(
  exerciseId: string,
  base64Data: string,
  mimeType: string
) {
  const user = await requireRole('PROVIDER')

  // Verify ownership
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, creatorId: user.id },
  })

  if (!exercise) {
    return { success: false, error: 'Exercise not found' }
  }

  try {
    // Decode base64 and compress
    const buffer = Buffer.from(base64Data, 'base64')
    const compressed = await compressImage(buffer)

    // Get current max order
    const maxOrder = await prisma.exerciseMedia.aggregate({
      where: { exerciseId },
      _max: { order: true },
    })

    await prisma.exerciseMedia.create({
      data: {
        exerciseId,
        type: 'IMAGE',
        imageData: compressed,
        mimeType: 'image/webp',
        order: (maxOrder._max.order ?? -1) + 1,
      },
    })

    revalidatePath(`/provider/exercises/${exerciseId}`)

    return { success: true }
  } catch (error) {
    console.error('Failed to upload image:', error)
    return { success: false, error: 'Failed to upload image' }
  }
}

export async function deleteMedia(mediaId: string) {
  const user = await requireRole('PROVIDER')

  // Verify ownership through exercise
  const media = await prisma.exerciseMedia.findFirst({
    where: { id: mediaId },
    include: { exercise: true },
  })

  if (!media || media.exercise.creatorId !== user.id) {
    return { success: false, error: 'Media not found' }
  }

  try {
    await prisma.exerciseMedia.delete({ where: { id: mediaId } })
    revalidatePath(`/provider/exercises/${media.exerciseId}`)
    return { success: true }
  } catch (error) {
    console.error('Failed to delete media:', error)
    return { success: false, error: 'Failed to delete media' }
  }
}
