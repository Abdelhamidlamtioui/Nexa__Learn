// LoginPage.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { ForumHeader } from "@/components/forum-header"
import { LoginForm } from "@/components/login/login-form"
import { StatisticsTicker } from "@/components/login/statistics-ticker"
import { AchievementsFeed } from "@/components/login/achievements-feed"
import { TokenValue } from "@/components/login/token-value"
import { QuickLinks } from "@/components/login/quick-links"
import { authService } from "@/services/api"

export function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (formData: {username: string; password: string}) => {
    setIsSubmitting(true)
    setError("")

    try {
      const response = await authService.login(formData)

      if (response.data.success) {
        const token = response.data.data.token
        localStorage.setItem("token", token)

        toast({
          title: "Login successful",
          description: "Welcome back!"
        })

        router.push("/dev-forum/me")
      }
    } catch (error: any) {
      // Check for specific error message about disabled account
      const errorResponse = error.response?.data;
      let errorMsg = errorResponse?.message || "Invalid credentials";
      
      // Special handling for disabled account
      if (errorResponse?.code === "USER_DISABLED" || errorMsg.includes("disabled") || errorMsg.includes("enabled")) {
        errorMsg = "Your account has been disabled. Please contact an administrator.";
      }
      
      setError(errorMsg);
      toast({
        title: "Login failed",
        description: errorMsg,
        variant: "destructive"
      })
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-deep-navy to-rich-purple text-white">
        <ForumHeader />
        <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center mb-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-transparent bg-clip-text">
                Welcome Back
              </h1>
              <p className="text-lg text-gray-300">Login to continue your learning journey</p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} error={error} />
            </div>
            <div className="space-y-8">
              <StatisticsTicker />
              <AchievementsFeed />
              <TokenValue />
              <QuickLinks />
            </div>
          </div>
        </main>
      </div>
  )
}