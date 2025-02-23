"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Coins, Trophy } from "lucide-react"

export function SocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
        <CardHeader>
          <CardTitle>Community Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-400" />
            <div>
              <p className="text-sm">Active Users</p>
              <p className="text-2xl font-bold">100,000+</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Coins className="w-6 h-6 text-yellow-400" />
            <div>
              <p className="text-sm">TT Distributed</p>
              <p className="text-2xl font-bold">5,000,000+</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-sm">Top Earner</p>
              <p className="text-2xl font-bold">50,000 TT</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

