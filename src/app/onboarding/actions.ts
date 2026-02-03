'use server'

import { setUserRole } from '@/lib/sync-user'
import type { Role } from '../../../prisma/generated/prisma/client'

/**
 * Server action to set user role during onboarding
 */
export async function setRole(role: Role) {
  return setUserRole(role)
}
