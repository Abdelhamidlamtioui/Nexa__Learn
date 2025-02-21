"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Coins } from "lucide-react"

export function TokenValue() {
  const [tokenValue, setTokenValue] = useState(1.23)
  const [trend, setTrend] = useState<"up" | "down" | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const newValue = tokenValue + (Math.random() - 0.5) * 0.05
      setTokenValue(Number(newValue.toFixed(2)))
      setTrend(newValue > tokenValue ? "up" : "down")
    }, 5000)

    return () => clearInterval(interval)
  }, [tokenValue])

  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-2">Current Token Value</h3>
        <div className="flex items-center space-x-2">
          <Coins className="w-6 h-6 text-yellow-400" />
          <motion.div
            key={tokenValue}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-2xl font-bold">${tokenValue.toFixed(2)}</span>
            {trend && (
              <span className={`ml-2 ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {trend === "up" ? "▲" : "▼"}
              </span>
            )}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

