"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export { LatestActivityFeed }

const activityTypes = [
  { type: "course_launch", label: "New Course", color: "bg-green-500" },
  { type: "achievement", label: "Achievement Unlocked", color: "bg-yellow-500" },
  { type: "discussion", label: "New Discussion", color: "bg-blue-500" },
  { type: "project", label: "Project Showcase", color: "bg-purple-500" },
  { type: "badge", label: "Badge Awarded", color: "bg-pink-500" },
]

const generateRandomActivity = () => {
  const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
  const user = `user${Math.floor(Math.random() * 1000)}`
  let content = ""

  switch (type.type) {
    case "course_launch":
      content = `New course "${["React Mastery", "Python for Data Science", "DevOps Essentials"][Math.floor(Math.random() * 3)]}" is now available!`
      break
    case "achievement":
      content = `${user} has achieved "${["Code Ninja", "Bug Squasher", "Performance Guru"][Math.floor(Math.random() * 3)]}"`
      break
    case "discussion":
      content = `${user} started a new discussion: "${["Best practices for clean code", "How to optimize database queries", "UI/UX trends in 2023"][Math.floor(Math.random() * 3)]}"`
      break
    case "project":
      content = `${user} showcased project: "${["E-commerce platform", "Machine learning model", "Mobile game"][Math.floor(Math.random() * 3)]}"`
      break
    case "badge":
      content = `${user} was awarded the "${["Early Bird", "Top Contributor", "Quick Learner"][Math.floor(Math.random() * 3)]}" badge`
      break
  }

  return { type, content, timestamp: new Date().toISOString() }
}

function LatestActivityFeed() {
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const initialActivities = Array(5).fill(null).map(generateRandomActivity)
    setActivities(initialActivities)

    const interval = setInterval(() => {
      setActivities((prevActivities) => {
        const newActivity = generateRandomActivity()
        return [newActivity, ...prevActivities.slice(0, 4)]
      })
    }, 5000)

    return () => clearInterval(interval)
  }, []) // Empty dependency array
}

