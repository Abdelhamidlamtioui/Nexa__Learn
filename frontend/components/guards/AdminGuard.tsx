import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

interface AdminGuardProps {
  children: ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const { user, isAuthenticated, loading, fetchUser } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)
  
  // Check if user has ADMIN role
  const hasAdminRole = () => {
    if (!user || !user.roles) return false
    
    // Check specifically for "ADMIN" role string as shown in API response
    return Array.isArray(user.roles) && user.roles.includes("ADMIN")
  }

  useEffect(() => {
    // Function to check user status
    async function checkAccess() {
      console.log("AdminGuard - Starting check, current user:", user)
      
      try {
        // Only fetch user if not already authenticated
        if (!isAuthenticated || !user) {
          console.log("AdminGuard - Fetching user data...")
          await fetchUser()
        } else {
          console.log("AdminGuard - User already authenticated:", user)
        }
      } catch (error) {
        console.error("AdminGuard - Error fetching user:", error)
      } finally {
        // Always finish checking to prevent infinite loading
        console.log("AdminGuard - Finished checking")
        setIsChecking(false)
      }
    }
    
    checkAccess()
  }, [fetchUser, isAuthenticated, user])

  // Show loading state only while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#663399] flex items-center justify-center">
        <div className="text-white text-xl p-4">
          <p className="mb-2">Checking admin status...</p>
          <p className="text-sm text-gray-300">This may take a few moments.</p>
          <pre className="mt-4 text-xs p-4 bg-black bg-opacity-30 rounded overflow-auto max-h-80 max-w-xl">
            {JSON.stringify(user, null, 4)}
          </pre>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    console.log("AdminGuard - Not authenticated, redirecting to login")
    router.push('/login')
    return null
  }

  // Check admin role and redirect if not admin
  if (!hasAdminRole()) {
    console.log("AdminGuard - User is not admin, redirecting to home", user?.roles)
    router.push('/')
    return null
  }

  // User is authenticated and has admin role
  console.log("AdminGuard - Access granted")
  return <>{children}</>
} 