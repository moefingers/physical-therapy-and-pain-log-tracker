import { prisma } from '@/lib/db'
import { stackServerApp } from '@/stack/server'
import type { Role } from '../../prisma/generated/prisma/client'

/**
 * Syncs the current Stack Auth user to Prisma database.
 * Creates user if first time, updates display name on subsequent calls.
 *
 * @param defaultRole - Role to assign if creating a new user (default: PATIENT)
 * @returns The Prisma user record, or null if not authenticated
 */
export async function syncUser(defaultRole: Role = 'PATIENT') {
  const stackUser = await stackServerApp.getUser()

  if (!stackUser) return null

  const user = await prisma.user.upsert({
    where: { stackAuthId: stackUser.id },
    update: {
      displayName: stackUser.displayName ?? undefined,
      email: stackUser.primaryEmail?.toLowerCase() ?? undefined,
    },
    create: {
      stackAuthId: stackUser.id,
      email: stackUser.primaryEmail!.toLowerCase(),
      displayName: stackUser.displayName,
      role: defaultRole,
    },
  })

  return user
}

/**
 * Gets the current user from Prisma (if synced).
 * Does not sync - use syncUser() to ensure user exists.
 *
 * @returns The Prisma user record, or null if not found/authenticated
 */
export async function getCurrentUser() {
  const stackUser = await stackServerApp.getUser()

  if (!stackUser) return null

  return prisma.user.findUnique({
    where: { stackAuthId: stackUser.id },
  })
}

/**
 * Requires user to be authenticated and have a specific role.
 * Throws error if not authenticated or wrong role.
 *
 * @param role - Required role
 * @returns The Prisma user record
 */
export async function requireRole(role: Role) {
  const user = await syncUser()
  if (!user) throw new Error('Not authenticated')
  if (user.role !== role) throw new Error('Unauthorized - wrong role')
  return user
}

/**
 * Requires user to be authenticated (any role).
 * Throws error if not authenticated.
 *
 * @returns The Prisma user record
 */
export async function requireUser() {
  const user = await syncUser()
  if (!user) throw new Error('Not authenticated')
  return user
}

/**
 * Updates user's role (for onboarding)
 *
 * @param role - New role to set
 * @returns Updated user record
 */
export async function setUserRole(role: Role) {
  const user = await syncUser()
  if (!user) throw new Error('Not authenticated')

  return prisma.user.update({
    where: { id: user.id },
    data: { role },
  })
}
