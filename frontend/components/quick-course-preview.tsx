import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, Award, Book, MessageSquare, Trophy } from "lucide-react"

interface QuickCoursePreviewProps {
  course: {
    id: number
    title: string
    description: string
    thumbnail: string
    difficulty: string
    xpReward: number
    instructor: string
    instructorReputation: string
    progress: number
    completionRate: number
    studentCount: number
    rating: number
    duration: string
    techTokens: number
    techStack: string[]
    prerequisites: string[]
  }
}

export function QuickCoursePreview({ course }: QuickCoursePreviewProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Quick Preview</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{course.title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{course.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Award className="mr-2 h-4 w-4" />
                      <span className="text-sm">{course.difficulty}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span className="text-sm">{course.studentCount} students</span>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="mr-2 h-4 w-4" />
                      <span className="text-sm">{course.xpReward} XP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    <li>Module 1: Introduction</li>
                    <li>Module 2: Core Concepts</li>
                    <li>Module 3: Advanced Techniques</li>
                    <li>Module 4: Project Work</li>
                    <li>Module 5: Final Assessment</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside">
                    <li>Course textbook</li>
                    <li>Online coding environment</li>
                    <li>Supplementary video lectures</li>
                    <li>Practice exercises</li>
                    <li>Project templates</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="community">
              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="text-sm">Active discussion forum</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Users className="mr-2 h-4 w-4" />
                    <span className="text-sm">Study groups available</span>
                  </div>
                  <div className="flex items-center">
                    <Book className="mr-2 h-4 w-4" />
                    <span className="text-sm">Weekly live Q&A sessions</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

