import Link from 'next/link'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { Activity, ClipboardList, UserCheck, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div
      className={cn(
        'min-h-screen flex flex-col items-center justify-center p-8',
        tw.bg.main
      )}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className={cn('text-4xl font-bold mb-4', tw.text.primary)}>
          PT & Pain Tracker
        </h1>
        <p className={cn('text-lg max-w-md', tw.text.secondary)}>
          Track your physical therapy exercises and monitor pain levels with
          your healthcare provider
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid md:grid-cols-2 gap-6 max-w-2xl w-full mb-12">
        <FeatureCard
          icon={<ClipboardList className="w-8 h-8" />}
          title="Exercise Tracking"
          description="Log your exercises, sets, and reps with scheduled reminders"
        />
        <FeatureCard
          icon={<Activity className="w-8 h-8" />}
          title="Pain Logging"
          description="Track pain levels by activity and body region over time"
        />
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title="Provider Connection"
          description="Connect with your provider to receive prescribed exercises"
        />
        <FeatureCard
          icon={<UserCheck className="w-8 h-8" />}
          title="Progress Monitoring"
          description="View your history and track improvement over time"
        />
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth#sign-in"
          className={cn('px-8 py-3 text-lg font-medium', tw.btn.primary)}
        >
          Sign In
        </Link>
        <Link
          href="/auth#sign-up"
          className={cn('px-8 py-3 text-lg font-medium', tw.btn.secondary)}
        >
          Create Account
        </Link>
      </div>

      {/* Footer */}
      <footer className={cn('mt-16 text-sm', tw.text.muted)}>
        <p>Secure, private, and designed for your recovery journey</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className={cn('p-6', tw.card.default)}>
      <div className={cn('mb-4', tw.text.accent)}>{icon}</div>
      <h3 className={cn('text-lg font-semibold mb-2', tw.text.primary)}>
        {title}
      </h3>
      <p className={cn('text-sm', tw.text.secondary)}>{description}</p>
    </div>
  )
}
