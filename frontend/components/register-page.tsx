"use client"

import {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { ForumHeader } from "@/components/forum-header"
import { HeroSection } from "@/components/register/hero-section"
import { RegistrationForm } from "@/components/register/registration-form"
import { SocialProof } from "@/components/register/social-proof"
import { OnboardingPreview } from "@/components/register/onboarding-preview"
import { authService } from "@/services/api"
import confetti from 'canvas-confetti'

function Confetti() {
  useEffect(() => { 
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  return null;
}

export function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSubmit = async (formData: any) => {
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the terms and token economy",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)
    try {
      await authService.register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        role: formData.role.toUpperCase()
      })

      setShowConfetti(true)
      toast({
        title: "Registration successful",
        description: "Welcome! Please log in to continue."
      })
      setTimeout(() => {
        setShowConfetti(false)
        router.push("/login")
      }, 5000)
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-deep-navy to-rich-purple text-white">
        <ForumHeader />
        <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <RegistrationForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            <div className="space-y-8">
              <SocialProof />
              <OnboardingPreview />
            </div>
          </div>
        </main>
        {showConfetti && <Confetti />}
      </div>
  )
}