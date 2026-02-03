import { AuthTabs } from '@/components/shared'
import { tw } from '@/lib/tw-theme'
import { cn } from '@/lib/cn'
import Link from 'next/link'
import { Activity } from 'lucide-react'

export default function AuthPage() {
  return (
    <main
      className={cn(
        'min-h-dvh flex flex-col items-center justify-center p-4 gap-6',
        tw.bg.main
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <Activity className={cn('w-10 h-10', tw.text.primary)} />
        <span className={cn('text-xl font-bold', tw.text.primary)}>
          PT Tracker
        </span>
      </Link>
      <AuthTabs />
    </main>
  )
}
