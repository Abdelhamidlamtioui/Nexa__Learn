"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Info, AlertTriangle } from "lucide-react"

export function TradingControlsDocumentation() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [tradeAmount, setTradeAmount] = useState("")

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const calculateFee = () => {
    const amount = Number.parseFloat(tradeAmount) || 0
    return (amount * 0.001).toFixed(2) // 0.1% fee
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trading Controls Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Trading Limits</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Daily limit: 10,000 ELP</li>
              <li>Monthly limit: 100,000 ELP</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("limits")}>
              <Info className="mr-2 h-4 w-4" /> Why limits?
            </Button>
            {expandedSection === "limits" && (
              <div className="mt-2 text-sm">
                <p>
                  Trading limits are in place to prevent market manipulation and ensure liquidity. These limits may be
                  adjusted through governance proposals.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Fee Structure</h3>
            <p>Standard fee: 0.1% per trade</p>
            <div className="mt-2">
              <Input
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(e.target.value)}
                placeholder="Enter trade amount"
              />
              <p className="mt-1">Estimated fee: {calculateFee()} ELP</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("fees")}>
              <Info className="mr-2 h-4 w-4" /> Fee allocation
            </Button>
            {expandedSection === "fees" && (
              <div className="mt-2 text-sm">
                <p>50% of fees are burned, 30% go to the community treasury, and 20% to the development fund.</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Order Types</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Market orders</li>
              <li>Limit orders</li>
              <li>Stop-loss orders</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("orderTypes")}>
              <Info className="mr-2 h-4 w-4" /> Learn more
            </Button>
            {expandedSection === "orderTypes" && (
              <div className="mt-2 text-sm">
                <p>
                  Different order types allow for various trading strategies. Market orders execute immediately, while
                  limit and stop-loss orders provide more control over entry and exit points.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Trading Pairs</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>ELP/USDT</li>
              <li>ELP/ETH</li>
              <li>ELP/BTC</li>
            </ul>
          </div>

          <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Risk Warning
            </h3>
            <p className="text-sm">
              Trading cryptocurrencies carries a high level of risk, and may not be suitable for all investors. Before
              deciding to trade cryptocurrency you should carefully consider your investment objectives, level of
              experience, and risk appetite.
            </p>
          </div>

          <Button className="w-full">Open Trading Interface</Button>
        </div>
      </CardContent>
    </Card>
  )
}

