import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const tickets = [
  { 
    id: 1,
    title: "Login issues",
    status: "open",
    priority: "high",
    lastUpdated: "2h ago"
  },
  { 
    id: 2,
    title: "Course payment failed",
    status: "in-progress",
    priority: "medium",
    lastUpdated: "4h ago"
  },
  { 
    id: 3,
    title: "Documentation request",
    status: "closed",
    priority: "low",
    lastUpdated: "1d ago"
  },
]

export function SupportTickets() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
              <div className="flex items-center space-x-3">
                {ticket.priority === "high" ? (
                  <AlertCircle className="h-5 w-5 text-red-400" />
                ) : ticket.priority === "medium" ? (
                  <MessageSquare className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Mail className="h-5 w-5 text-green-400" />
                )}
                <div>
                  <p className="font-medium">{ticket.title}</p>
                  <p className="text-sm text-muted-foreground">{ticket.lastUpdated}</p>
                </div>
              </div>
              <Badge variant={
                ticket.status === "open" ? "destructive" :
                ticket.status === "in-progress" ? "warning" : "default"
              }>
                {ticket.status}
              </Badge>
            </div>
          ))}
          <Button className="w-full mt-4" variant="outline">
            View All Tickets
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 