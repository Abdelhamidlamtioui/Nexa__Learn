import * as React from "react"
import { cn } from "@/lib/utils"

interface GaugeProps {
  value: number
  size?: "small" | "medium" | "large"
  className?: string
}

export function Gauge({ value, size = "medium", className }: GaugeProps) {
  const sizeClasses = {
    small: "h-16 w-16 text-sm",
    medium: "h-24 w-24 text-lg",
    large: "h-32 w-32 text-xl",
  }

  const strokeWidth = {
    small: 8,
    medium: 10,
    large: 12,
  }

  const radius = {
    small: 30,
    medium: 45,
    large: 60,
  }

  const circumference = 2 * Math.PI * radius[size]
  const progress = circumference - (value / 100) * circumference

  return (
    <div className={cn("relative inline-block", sizeClasses[size], className)}>
      <svg className="h-full w-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-700"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          fill="transparent"
          r={radius[size] / 2}
          cx="50"
          cy="50"
        />
        <circle
          className="text-purple-500"
          stroke="currentColor"
          strokeWidth={strokeWidth[size]}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          fill="transparent"
          r={radius[size] / 2}
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-medium text-white">{value}%</span>
      </div>
    </div>
  )
} 