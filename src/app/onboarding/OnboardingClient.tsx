'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { Button } from '@/components/ui'
import { Stethoscope, User } from 'lucide-react'
import { setRole } from './actions'
import type { Role } from '../../../prisma/generated/prisma/client'

interface OnboardingClientProps {
  currentRole: Role
}

export function OnboardingClient({ currentRole }: OnboardingClientProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleContinue = async () => {
    setIsLoading(true)
    try {
      await setRole(selectedRole)
      // Redirect based on role
      if (selectedRole === 'PROVIDER') {
        router.push('/provider')
      } else {
        router.push('/patient')
      }
    } catch (error) {
      console.error('Failed to set role:', error)
      setIsLoading(false)
    }
  }

  return (
    <main
      className={cn(
        'min-h-dvh flex flex-col items-center justify-center p-4',
        tw.bg.main
      )}
    >
      <div className="max-w-md w-full">
        <h1 className={cn('text-2xl font-bold text-center mb-2', tw.text.primary)}>
          Welcome to PT Tracker
        </h1>
        <p className={cn('text-center mb-8', tw.text.secondary)}>
          Select your role to continue
        </p>

        <div className="grid gap-4 mb-8">
          <RoleCard
            role="PATIENT"
            title="I'm a Patient"
            description="Track your exercises, log pain levels, and follow your provider's prescriptions"
            icon={<User className="w-8 h-8" />}
            isSelected={selectedRole === 'PATIENT'}
            onClick={() => setSelectedRole('PATIENT')}
          />
          <RoleCard
            role="PROVIDER"
            title="I'm a Provider"
            description="Create exercise programs, prescribe to patients, and monitor their progress"
            icon={<Stethoscope className="w-8 h-8" />}
            isSelected={selectedRole === 'PROVIDER'}
            onClick={() => setSelectedRole('PROVIDER')}
          />
        </div>

        <Button
          onClick={handleContinue}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          Continue as {selectedRole === 'PROVIDER' ? 'Provider' : 'Patient'}
        </Button>
      </div>
    </main>
  )
}

interface RoleCardProps {
  role: Role
  title: string
  description: string
  icon: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

function RoleCard({
  title,
  description,
  icon,
  isSelected,
  onClick,
}: RoleCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'p-6 rounded-xl border-2 text-left transition-all',
        tw.bg.card,
        isSelected
          ? cn(tw.border.primary, 'ring-2', tw.ring.primary)
          : cn(tw.border.default, tw.hover.border.primary)
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'p-3 rounded-lg',
            isSelected ? tw.bg.primaryMuted : tw.bg.elevated,
            isSelected ? tw.text.primary : tw.text.secondary
          )}
        >
          {icon}
        </div>
        <div>
          <h3 className={cn('text-lg font-semibold mb-1', tw.text.primary)}>
            {title}
          </h3>
          <p className={cn('text-sm', tw.text.secondary)}>{description}</p>
        </div>
      </div>
    </button>
  )
}
