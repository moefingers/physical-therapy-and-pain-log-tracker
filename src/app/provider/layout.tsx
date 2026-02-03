import { redirect } from 'next/navigation'
import { syncUser } from '@/lib/sync-user'
import { Sidebar } from '@/components/layout'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await syncUser()

  // If not authenticated, redirect to auth
  if (!user) {
    redirect('/auth#sign-in')
  }

  // If not a provider, redirect to patient dashboard
  if (user.role !== 'PROVIDER') {
    redirect('/patient')
  }

  return (
    <div className={cn('min-h-dvh', tw.bg.main)}>
      <Sidebar role="PROVIDER" />
      <main className="md:ml-64 min-h-dvh">
        <div className="p-4 pt-16 md:pt-4">{children}</div>
      </main>
    </div>
  )
}
