"use client"

import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
        Unlock your learning potential with our cutting-edge platform. Connect with peers, earn tokens, and build your knowledge portfolio.
      </p>
    </motion.div>
  )
}

