import type { Frequency } from '../../prisma/generated/prisma/client'

/**
 * Gets the interval in days for a given frequency
 */
function getIntervalDays(frequency: Frequency): number {
  switch (frequency) {
    case 'DAILY':
      return 1
    case 'EVERY_2_DAYS':
      return 2
    case 'EVERY_3_DAYS':
      return 3
    case 'WEEKLY':
      return 7
    case 'AS_NEEDED':
      return 0 // Always available
    default:
      return 1
  }
}

/**
 * Adds days to a date
 */
function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Checks if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}

/**
 * Gets the start of a day (midnight)
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Gets the start of today (midnight)
 */
export function startOfToday(): Date {
  return startOfDay(new Date())
}

/**
 * Calculates the next due date based on frequency
 *
 * @param frequency - Exercise frequency
 * @param lastPerformed - Date of last performance (null if never)
 * @param startDate - Prescription start date
 * @returns Next due date
 */
export function getNextDueDate(
  frequency: Frequency,
  lastPerformed: Date | null,
  startDate: Date
): Date {
  const now = new Date()

  // AS_NEEDED is always "due"
  if (frequency === 'AS_NEEDED') {
    return now
  }

  const intervalDays = getIntervalDays(frequency)
  const base = lastPerformed || startDate
  const nextDue = addDays(base, intervalDays)

  // If next due is in the past, it's overdue - return today
  if (nextDue < now) {
    return now
  }

  return nextDue
}

/**
 * Checks if an exercise is due today based on its frequency and last performance
 *
 * @param frequency - Exercise frequency
 * @param lastPerformed - Date of last performance (null if never)
 * @param startDate - Prescription start date
 * @returns True if exercise is due today
 */
export function isDueToday(
  frequency: Frequency,
  lastPerformed: Date | null,
  startDate: Date
): boolean {
  // AS_NEEDED is always available
  if (frequency === 'AS_NEEDED') return true

  const nextDue = getNextDueDate(frequency, lastPerformed, startDate)
  const today = new Date()

  // Due if next due date is today or overdue (in the past)
  return isSameDay(nextDue, today) || nextDue < today
}

/**
 * Checks if an exercise was completed today
 *
 * @param lastPerformed - Date of last performance
 * @returns True if completed today
 */
export function wasCompletedToday(lastPerformed: Date | null): boolean {
  if (!lastPerformed) return false
  return isSameDay(lastPerformed, new Date())
}

/**
 * Gets the human-readable frequency label
 *
 * @param frequency - Frequency enum value
 * @returns Human-readable label
 */
export function getFrequencyLabel(frequency: Frequency): string {
  switch (frequency) {
    case 'DAILY':
      return 'Daily'
    case 'EVERY_2_DAYS':
      return 'Every 2 days'
    case 'EVERY_3_DAYS':
      return 'Every 3 days'
    case 'WEEKLY':
      return 'Weekly'
    case 'AS_NEEDED':
      return 'As needed'
    default:
      return frequency
  }
}

/**
 * Calculates completion rate for a prescription over a time period
 *
 * @param frequency - Exercise frequency
 * @param logsInPeriod - Number of logs in the period
 * @param periodDays - Number of days in the period
 * @returns Completion rate (0-100)
 */
export function calculateCompletionRate(
  frequency: Frequency,
  logsInPeriod: number,
  periodDays: number
): number {
  if (frequency === 'AS_NEEDED') {
    // No expected count for as-needed
    return 100
  }

  const intervalDays = getIntervalDays(frequency)
  const expectedCount = Math.ceil(periodDays / intervalDays)

  if (expectedCount === 0) return 100
  return Math.min(100, Math.round((logsInPeriod / expectedCount) * 100))
}

/**
 * Gets the number of days since an exercise was last performed
 *
 * @param lastPerformed - Date of last performance
 * @returns Number of days, or null if never performed
 */
export function getDaysSinceLastPerformed(lastPerformed: Date | null): number | null {
  if (!lastPerformed) return null

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - lastPerformed.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
