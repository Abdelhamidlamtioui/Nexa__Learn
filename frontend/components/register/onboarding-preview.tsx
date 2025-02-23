"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, BookOpen, Users, Award } from "lucide-react"

export function OnboardingPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <CardHeader>
          <CardTitle>Your Journey Begins Here</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <p>
              <span className="font-bold">100 TT</span> welcome bonus
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-400" />
            <p>First course recommendation: Web Development Fundamentals</p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-green-400" />
            <p>Join our welcoming community of learners</p>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-400" />
            <p>
              Earn your first badge: <Badge variant="secondary">Eager Learner</Badge>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

