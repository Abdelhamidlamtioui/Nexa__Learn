"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function TradingControlsPanel() {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Trading Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Personal Token Balance</h4>
            <p>1,000 ELP</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Trading Limits</h4>
            <p>Daily: 5,000 ELP</p>
            <p>Monthly: 50,000 ELP</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Transaction Fee Tier</h4>
            <p>Tier 2: 0.1%</p>
          </div>
          <div className="flex space-x-2">
            <Button className="flex-1">Buy ELP</Button>
            <Button className="flex-1" variant="outline">
              Sell ELP
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

