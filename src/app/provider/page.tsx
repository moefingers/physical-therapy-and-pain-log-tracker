import { prisma } from '@/lib/db'
import { syncUser } from '@/lib/sync-user'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { ClipboardList, Users, Activity } from 'lucide-react'
import Link from 'next/link'

export default async function ProviderDashboard() {
  const user = await syncUser()
  if (!user) return null

  // Get stats
  const [exerciseCount, patientCount, prescriptionCount] = await Promise.all([
    prisma.exercise.count({ where: { creatorId: user.id } }),
    prisma.patientProvider.count({
      where: { providerId: user.id, isAccepted: true },
    }),
    prisma.prescription.count({
      where: { providerId: user.id, isActive: true },
    }),
  ])

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className={cn('text-2xl font-bold mb-6', tw.text.primary)}>
        Welcome back, {user.displayName || 'Provider'}
      </h1>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<ClipboardList className="w-6 h-6" />}
          title="Exercises"
          value={exerciseCount}
          href="/provider/exercises"
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          title="Patients"
          value={patientCount}
          href="/provider/patients"
        />
        <StatCard
          icon={<Activity className="w-6 h-6" />}
          title="Active Prescriptions"
          value={prescriptionCount}
          href="/provider/patients"
        />
      </div>

      {/* Quick actions */}
      <h2 className={cn('text-lg font-semibold mb-4', tw.text.primary)}>
        Quick Actions
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/provider/exercises/new"
          className={cn('p-4 rounded-xl', tw.card.interactive)}
        >
          <h3 className={cn('font-medium mb-1', tw.text.primary)}>
            Add New Exercise
          </h3>
          <p className={cn('text-sm', tw.text.secondary)}>
            Create a new exercise for your library
          </p>
        </Link>
        <Link
          href="/provider/patients"
          className={cn('p-4 rounded-xl', tw.card.interactive)}
        >
          <h3 className={cn('font-medium mb-1', tw.text.primary)}>
            Invite a Patient
          </h3>
          <p className={cn('text-sm', tw.text.secondary)}>
            Generate an invite code for a new patient
          </p>
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode
  title: string
  value: number
  href: string
}) {
  return (
    <Link href={href} className={cn('p-4', tw.card.interactive)}>
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-lg', tw.bg.primaryMuted, tw.text.primary)}>
          {icon}
        </div>
        <div>
          <p className={cn('text-2xl font-bold', tw.text.primary)}>{value}</p>
          <p className={cn('text-sm', tw.text.secondary)}>{title}</p>
        </div>
      </div>
    </Link>
  )
}
