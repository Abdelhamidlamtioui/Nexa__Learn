"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function HeroSection() {
  const [stats, setStats] = useState({
    activeLearners: 10000,
    recentAchievement: "Advanced AI Specialist",
    hotTopic: "Machine Learning Fundamentals",
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeLearners: prev.activeLearners + Math.floor(Math.random() * 10),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gradient-to-br from-blue-900 to-blue-900 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Nexa Learn
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Journey to Tech Excellence Starts Here
        </motion.p>
        {/*<motion.div*/}
        {/*  className="bg-white bg-opacity-10 rounded-lg p-4 mb-8"*/}
        {/*  initial={{ opacity: 0, y: 20 }}*/}
        {/*  animate={{ opacity: 1, y: 0 }}*/}
        {/*  transition={{ duration: 0.5, delay: 0.4 }}*/}
        {/*>*/}
        {/*  <p className="text-lg">*/}
        {/*    <span className="font-bold">{stats.activeLearners.toLocaleString()}</span> active learners*/}
        {/*    <span className="mx-2">•</span>*/}
        {/*    Recent achievement: <span className="font-bold">{stats.recentAchievement}</span>*/}
        {/*    <span className="mx-2">•</span>*/}
        {/*    Hot topic: <span className="font-bold">{stats.hotTopic}</span>*/}
        {/*  </p>*/}
        {/*</motion.div>*/}
        <div className="space-x-4">
          <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700">
            Start Learning
          </Button>
          <Button size="lg" variant="outline">
            Browse Courses
          </Button>
        </div>
      </div>
    </div>
  )
}

