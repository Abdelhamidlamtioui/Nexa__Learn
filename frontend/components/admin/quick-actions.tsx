import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle, BarChart2, Users } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button className="w-full" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
          <Button className="w-full" variant="outline">
            <AlertCircle className="mr-2 h-4 w-4" />
            Moderate Content
          </Button>
          <Button className="w-full" variant="outline">
            <BarChart2 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/dev-forum/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

