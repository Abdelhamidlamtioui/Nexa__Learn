import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, Coins, Activity } from "lucide-react"

export function StatisticsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12,345</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">234</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Coins className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$23,456</div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Now</CardTitle>
          <Activity className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
        </CardContent>
      </Card>
    </div>
  )
}
