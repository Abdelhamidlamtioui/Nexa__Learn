 import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

interface AuthGuardProps {
  children: ReactNode
  mode: 'auth' | 'guest' // 'auth' for protected routes, 'guest' for non-authenticated only routes
}

export function AuthGuard({ children, mode }: AuthGuardProps) {
  const router = useRouter()
  const { isAuthenticated, loading, initialized, fetchUser } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  // Fetch user and check authentication status
  useEffect(() => {
    setMounted(true)
    if (!initialized) {
      fetchUser().catch(() => {
        // Handle fetch error if needed
      })
    }
  }, [initialized, fetchUser])

  // Handle redirects based on authentication status
  useEffect(() => {
    if (mounted && initialized && !loading) {
      if (mode === 'guest' && isAuthenticated) {
        router.push('/')
      } else if (mode === 'auth' && !isAuthenticated) {
        router.push('/login')
      }
    }
  }, [mounted, initialized, loading, isAuthenticated, mode, router])

  // Show loading state while checking authentication
  if (!mounted || !initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#663399] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  // For guest routes, only render if not authenticated
  if (mode === 'guest' && isAuthenticated) {
    return null
  }

  // For protected routes, only render if authenticated
  if (mode === 'auth' && !isAuthenticated) {
    return null
  }

  return <div>{children}</div>
}