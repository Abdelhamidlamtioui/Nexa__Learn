import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge } from "@/components/ui/gauge"

export function SystemHealth() {
  return (
    <Card className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg">
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>API Server</span>
            <Gauge value={95} size="small" />
          </div>
          <div className="flex items-center justify-between">
            <span>Database</span>
            <Gauge value={88} size="small" />
          </div>
          <div className="flex items-center justify-between">
            <span>Storage</span>
            <Gauge value={72} size="small" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 