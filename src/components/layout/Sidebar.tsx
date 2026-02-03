'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/cn'
import { tw } from '@/lib/tw-theme'
import { useUser, useStackApp } from '@stackframe/stack'
import {
  Activity,
  ClipboardList,
  Home,
  LogOut,
  Menu,
  Users,
  X,
  History,
  Plus,
} from 'lucide-react'
import { useState } from 'react'
import type { Role } from '../../../prisma/generated/prisma/client'

interface SidebarProps {
  role: Role
}

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
}

const providerNavItems: NavItem[] = [
  { href: '/provider', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  {
    href: '/provider/exercises',
    label: 'Exercise Library',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    href: '/provider/patients',
    label: 'Patients',
    icon: <Users className="w-5 h-5" />,
  },
]

const patientNavItems: NavItem[] = [
  { href: '/patient', label: 'Today', icon: <Home className="w-5 h-5" /> },
  {
    href: '/patient/exercises',
    label: 'My Exercises',
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    href: '/patient/pain',
    label: 'Pain Log',
    icon: <Activity className="w-5 h-5" />,
  },
  {
    href: '/patient/history',
    label: 'History',
    icon: <History className="w-5 h-5" />,
  },
]

export function Sidebar({ role }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const user = useUser()
  const app = useStackApp()

  const navItems = role === 'PROVIDER' ? providerNavItems : patientNavItems

  const handleSignOut = async () => {
    await app.signOut()
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'fixed top-4 left-4 z-50 p-2 rounded-lg md:hidden',
          tw.bg.card,
          tw.border.default,
          'border'
        )}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-dvh w-64 flex flex-col',
          tw.bg.sidebar,
          tw.border.default,
          'border-r',
          'transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className={cn('p-4 border-b', tw.border.default)}>
          <Link
            href={role === 'PROVIDER' ? '/provider' : '/patient'}
            className="flex items-center gap-2"
          >
            <Activity className={cn('w-8 h-8', tw.text.primary)} />
            <span className={cn('font-bold', tw.text.primary)}>PT Tracker</span>
          </Link>
          <p className={cn('text-xs mt-1', tw.text.muted)}>
            {role === 'PROVIDER' ? 'Provider Dashboard' : 'Patient Dashboard'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                      isActive
                        ? cn(tw.bg.primaryMuted, tw.text.primary)
                        : cn(tw.text.secondary, tw.hover.bg.subtle)
                    )}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Quick action for provider */}
          {role === 'PROVIDER' && (
            <div className="mt-6">
              <Link
                href="/provider/exercises/new"
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                  tw.btn.primary,
                  'w-full'
                )}
              >
                <Plus className="w-4 h-4" />
                New Exercise
              </Link>
            </div>
          )}

          {/* Quick action for patient */}
          {role === 'PATIENT' && (
            <div className="mt-6">
              <Link
                href="/patient/pain/new"
                className={cn(
                  'flex items-center justify-center gap-2 px-4 py-2 rounded-lg',
                  tw.btn.primary,
                  'w-full'
                )}
              >
                <Plus className="w-4 h-4" />
                Log Pain
              </Link>
            </div>
          )}
        </nav>

        {/* User section */}
        <div className={cn('p-4 border-t', tw.border.default)}>
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className={cn('text-sm font-medium truncate', tw.text.primary)}>
                {user?.displayName || 'User'}
              </p>
              <p className={cn('text-xs truncate', tw.text.muted)}>
                {user?.primaryEmail}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className={cn(
                'p-2 rounded-lg',
                tw.text.muted,
                tw.hover.bg.subtle,
                'transition-colors'
              )}
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
