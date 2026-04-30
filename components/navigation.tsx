'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  LogOut,
  Menu,
  X,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/seasons', label: 'Seasons', icon: Calendar },
  { href: '/fixtures', label: 'Fixtures', icon: Trophy },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/pin')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground shadow-md">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">West Green Darts</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-primary-foreground/20">
            <div className="flex flex-col p-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                      isActive
                        ? 'bg-primary-foreground/20 font-semibold'
                        : 'hover:bg-primary-foreground/10'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-primary-foreground/10 transition-colors text-left w-full"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 lg:bg-primary lg:text-primary-foreground">
        <div className="p-6 border-b border-primary-foreground/20">
          <h1 className="text-2xl font-bold">West Green Darts</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                  isActive
                    ? 'bg-primary-foreground/20 font-semibold'
                    : 'hover:bg-primary-foreground/10'
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-primary-foreground/20">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-primary-foreground hover:bg-primary-foreground/10"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
