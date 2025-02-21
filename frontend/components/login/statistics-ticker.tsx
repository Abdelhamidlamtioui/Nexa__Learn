"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Coins, BookOpen } from "lucide-react"

export function StatisticsTicker() {
  const [stats, setStats] = useState({
    activeLearners: 10000,
    totalTT: 5000000,
    coursesCompleted: 500,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        activeLearners: prevStats.activeLearners + Math.floor(Math.random() * 10),
        totalTT: prevStats.totalTT + Math.floor(Math.random() * 1000),
        coursesCompleted: prevStats.coursesCompleted + Math.floor(Math.random() * 5),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Live Statistics</h3>
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              <span>Active Learners:</span>
            </div>
            <span>{stats.activeLearners.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-4 h-4 mr-2 text-yellow-400" />
              <span>Total TT Distributed:</span>
            </div>
            <span>{stats.totalTT.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-2 text-green-400" />
              <span>Courses Completed Today:</span>
            </div>
            <span>{stats.coursesCompleted.toLocaleString()}</span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

