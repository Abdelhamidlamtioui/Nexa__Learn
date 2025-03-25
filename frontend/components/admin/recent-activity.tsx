import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const recentActivity = [
  {
    user: { name: "Alice Johnson", avatar: "/avatars/01.png" },
    action: "Completed course",
    course: "Advanced React Patterns",
    time: "2 hours ago",
    status: "success",
  },
  {
    user: { name: "Bob Smith", avatar: "/avatars/02.png" },
    action: "Started new course",
    course: "Blockchain Fundamentals",
    time: "4 hours ago",
    status: "info",
  },
  {
    user: { name: "Charlie Brown", avatar: "/avatars/03.png" },
    action: "Earned badge",
    course: "Top Contributor",
    time: "6 hours ago",
    status: "warning",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>Recent User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {activity.action}: <span className="font-medium">{activity.course}</span>
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Badge
                  variant={
                    activity.status === "success" ? "default" : 
                    activity.status === "warning" ? "warning" : "secondary"
                  }
                >
                  {activity.time}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 