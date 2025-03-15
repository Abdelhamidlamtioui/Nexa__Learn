"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"

const achievements = [
  { user: "Alice", achievement: "Completed Python Basics", badge: "Python Novice" },
  { user: "Bob", achievement: "Finished 30-Day Coding Challenge", badge: "Consistency King" },
  { user: "Charlie", achievement: "First Place in Hackathon", badge: "Hackathon Hero" },
  { user: "Diana", achievement: "100 Days of Code", badge: "Coding Centurion" },
  { user: "Ethan", achievement: "Helped 50 Students", badge: "Community Champion" },
]

export function AchievementsFeed() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % achievements.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Latest Achievements</h3>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex items-center space-x-2"
        >
          <Award className="w-6 h-6 text-yellow-400" />
          <div>
            <p className="text-sm">
              <span className="font-semibold">{achievements[currentIndex].user}</span>{" "}
              {achievements[currentIndex].achievement}
            </p>
            <Badge variant="secondary" className="mt-1">
              {achievements[currentIndex].badge}
            </Badge>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

