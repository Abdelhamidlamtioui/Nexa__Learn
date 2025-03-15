"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Join ELP's Learning Revolution</h1>
      <p className="text-xl mb-8">Earn tokens, gain knowledge, and shape the future of education</p>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-50 blur-xl"></div>
        <motion.div
          className="relative z-10"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <img src="/placeholder.svg?height=200&width=400" alt="Tech particles" className="mx-auto" />
        </motion.div>
      </div>
    </motion.div>
  )
}

