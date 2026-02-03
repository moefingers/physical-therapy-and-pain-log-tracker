import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/sync-user'
import { OnboardingClient } from './OnboardingClient'

export default async function OnboardingPage() {
  const user = await syncUser()

  // If not authenticated, redirect to auth
  if (!user) {
    redirect('/auth#sign-up')
  }

  // If user already has a role set (not first time), redirect to dashboard
  // Note: Default role is PATIENT, so we need another way to track if onboarding is complete
  // For now, we'll always show onboarding. In production, you might add an `onboardingComplete` field

  return <OnboardingClient currentRole={user.role} />
}
