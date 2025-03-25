import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

interface ModeratorGuardProps {
    children: ReactNode
}

export function ModeratorGuard({ children }: ModeratorGuardProps) {
    const router = useRouter()
    const { user, isAuthenticated, loading, fetchUser } = useAuthStore()
    const [isChecking, setIsChecking] = useState(true)

    // Check if user has Moderator role
    const hasModeratorRole = () => {
        if (!user || !user.roles) return false

        // Check specifically for "Moderator" role string as shown in API response
        return Array.isArray(user.roles) && user.roles.includes("MODERATOR") || user.roles.includes("ADMIN")
    }

    useEffect(() => {
        // Function to check user status
        async function checkAccess() {
            console.log("ModeratorGuard - Starting check, current user:", user)

            try {
                // Only fetch user if not already authenticated
                if (!isAuthenticated || !user) {
                    console.log("ModeratorGuard - Fetching user data...")
                    await fetchUser()
                } else {
                    console.log("ModeratorGuard - User already authenticated:", user)
                }
            } catch (error) {
                console.error("ModeratorGuard - Error fetching user:", error)
            } finally {
                // Always finish checking to prevent infinite loading
                console.log("ModeratorGuard - Finished checking")
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
                    <p className="mb-2">Checking Moderator status...</p>
                    <p className="text-sm text-gray-300">This may take a few moments.</p>
                    <pre className="mt-4 text-xs p-4 bg-black bg-opacity-30 rounded overflow-auto max-h-80 max-w-xl">
            {JSON.stringify(user, null, 4)}
          </pre>
                </div>
            </div>
        )
    }

    // Redirect if not authenticated or not Moderator
    if (!isAuthenticated) {
        console.log("ModeratorGuard - Not authenticated, redirecting to login")
        router.push('/login')
        return null
    }

    // Check Moderator role and redirect if not Moderator
    if (!hasModeratorRole()) {
        console.log("ModeratorGuard - User is not Moderator, redirecting to home", user?.roles)
        router.push('/')
        return null
    }

    // User is authenticated and has Moderator role
    console.log("ModeratorGuard - Access granted")
    return <>{children}</>
} 