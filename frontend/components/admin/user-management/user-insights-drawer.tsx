"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { userService } from "@/services/api"
import { Loader2 } from "lucide-react"

interface UserInsightsDrawerProps {
  userId: string | null
  open: boolean
  onClose: () => void
}

interface UserDetails {
  id: string
  username: string
  email: string
  avatar: string
  roles: string[]
  points: number
  enabled: boolean
  lastLogin: string
  createdAt: string
  courseProgress?: {
    courseName: string
    progress: number
  }[]
  pointsHistory?: {
    description: string
    points: number
    date: string
  }[]
  recentActivity?: {
    action: string
    timestamp: string
  }[]
}

export function UserInsightsDrawer({ userId, open, onClose }: UserInsightsDrawerProps) {
  const [loading, setLoading] = useState(true)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    if (userId && open) {
      loadUserDetails()
    }
  }, [userId, open])

  const loadUserDetails = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      const response = await userService.getUserDetails(userId)
      setUserDetails(response.data.data)
    } catch (error) {
      console.error('Failed to load user details:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!userId) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[400px] bg-[#1a2744] border-l border-gray-700 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">User Insights</SheetTitle>
          <SheetDescription className="text-gray-400">Detailed information about the user</SheetDescription>
        </SheetHeader>
        
        {loading ? (
          <div className="h-[calc(100vh-100px)] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : userDetails ? (
          <ScrollArea className="h-[calc(100vh-100px)] pr-4">
            <div className="space-y-6 mt-6">
              {/* User Profile */}
              <Card className="bg-[#2a3754] border border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={userDetails.avatar} />
                      <AvatarFallback>{userDetails.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{userDetails.username}</h3>
                      <p className="text-sm text-gray-400">{userDetails.email}</p>
                      <div className="flex gap-2 mt-2">
                        {userDetails.roles.map((role) => (
                          <Badge 
                            key={role}
                            className={
                              role === 'ADMIN' 
                                ? 'bg-red-500/80' 
                                : role === 'INSTRUCTOR' 
                                ? 'bg-blue-500/80' 
                                : 'bg-emerald-500/80'
                            }
                          >
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Points Overview */}
              <Card className="bg-[#2a3754] border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Points Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">
                    {userDetails.points.toLocaleString()} pts
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-[#2a3754] border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <Badge variant={userDetails.enabled ? "default" : "destructive"}>
                      {userDetails.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Joined</span>
                    <span>{new Date(userDetails.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login</span>
                    <span>
                      {userDetails.lastLogin 
                        ? new Date(userDetails.lastLogin).toLocaleDateString()
                        : 'Never'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Course Progress - If Available */}
              {userDetails.courseProgress && userDetails.courseProgress.length > 0 && (
                <Card className="bg-[#2a3754] border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {userDetails.courseProgress.map((course, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{course.courseName}</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="bg-gray-700" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Points History - If Available */}
              {userDetails.pointsHistory && userDetails.pointsHistory.length > 0 && (
                <Card className="bg-[#2a3754] border border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Points History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userDetails.pointsHistory.map((history, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{history.description}</p>
                            <p className="text-sm text-gray-400">
                              {new Date(history.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {history.points > 0 ? '+' : ''}{history.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="h-[calc(100vh-100px)] flex items-center justify-center text-gray-400">
            No user data available
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

