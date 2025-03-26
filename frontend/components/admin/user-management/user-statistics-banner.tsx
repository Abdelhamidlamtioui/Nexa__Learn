"use client"

import { useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Users, GraduationCap, ClapperboardIcon as ChalkboardTeacher, Activity } from "lucide-react"
import { useUserStore } from "@/stores/useUserStore"

interface Statistics {
  totalActiveUsers: number
  newUsersToday: number
  totalStudents: number
  totalInstructors: number
  avgEngagement: number
}

export function UserStatisticsBanner() {
  const { statistics, loading, fetchStatistics } = useUserStore()

  useEffect(() => {
    fetchStatistics()
  }, [fetchStatistics])

  const stats: Statistics = statistics || {
    totalActiveUsers: 0,
    newUsersToday: 0,
    totalStudents: 0,
    totalInstructors: 0,
    avgEngagement: 0
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20 transform transition-all duration-200 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-blue-500/20 rounded" />
            ) : (
              stats.totalActiveUsers.toLocaleString()
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="animate-pulse h-4 w-32 bg-blue-500/20 rounded" />
            ) : (
              `+${stats.newUsersToday} new today`
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 transform transition-all duration-200 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Students</CardTitle>
          <GraduationCap className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-emerald-500/20 rounded" />
            ) : (
              stats.totalStudents.toLocaleString()
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="animate-pulse h-4 w-32 bg-emerald-500/20 rounded" />
            ) : (
              `${((stats.totalStudents / stats.totalActiveUsers) * 100).toFixed(1)}% of users`
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20 transform transition-all duration-200 hover:scale-105">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">Instructors</CardTitle>
          <ChalkboardTeacher className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {loading ? (
              <div className="animate-pulse h-8 w-20 bg-amber-500/20 rounded" />
            ) : (
              stats.totalInstructors.toLocaleString()
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {loading ? (
              <div className="animate-pulse h-4 w-32 bg-amber-500/20 rounded" />
            ) : (
              `${((stats.totalInstructors / stats.totalActiveUsers) * 100).toFixed(1)}% of users`
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

