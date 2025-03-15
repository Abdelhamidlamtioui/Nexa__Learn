import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Clock, TrendingUp, Gift } from "lucide-react"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" /> Exchange
          </Button>
          <Button className="w-full">
            <Clock className="mr-2 h-4 w-4" /> History
          </Button>
          <Button className="w-full">
            <TrendingUp className="mr-2 h-4 w-4" /> Trade
          </Button>
          <Button className="w-full">
            <Gift className="mr-2 h-4 w-4" /> Gift
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

