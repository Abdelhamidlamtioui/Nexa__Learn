import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, AlertTriangle, CheckCircle } from "lucide-react"

const notifications = [
  { type: 'info', message: 'New system update available' },
  { type: 'warning', message: 'Scheduled maintenance tonight' },
  { type: 'success', message: 'Backup completed successfully' },
]

export function PlatformNotifications() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>System Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-start space-x-3">
            {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-400 mt-1" />}
            {notification.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-400 mt-1" />}
            {notification.type === 'success' && <CheckCircle className="h-5 w-5 text-green-400 mt-1" />}
            <p className="text-sm">{notification.message}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
