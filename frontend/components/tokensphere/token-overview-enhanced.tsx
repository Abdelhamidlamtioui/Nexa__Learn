"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Info } from "lucide-react"

const data = [
  { name: "Jan", price: 1.2 },
  { name: "Feb", price: 1.5 },
  { name: "Mar", price: 1.8 },
  { name: "Apr", price: 1.6 },
  { name: "May", price: 2.0 },
  { name: "Jun", price: 2.2 },
]

export function TokenOverviewEnhanced() {
  const [timeframe, setTimeframe] = useState("1M")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Enhanced Token Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">$2.20</h3>
            <p className="text-sm text-green-500">+10% (24h)</p>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("price")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "price" && (
              <div className="mt-2 text-sm">
                <p>Price is calculated using a time-weighted average price (TWAP) from multiple DEXs and CEXs.</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Market Cap</h3>
            <p>$220,000,000</p>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("marketCap")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "marketCap" && (
              <div className="mt-2 text-sm">
                <p>Market cap = Current price * Circulating supply</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold">Circulating Supply</h3>
            <p>100,000,000 ELP</p>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("supply")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "supply" && (
              <div className="mt-2 text-sm">
                <p>Controlled through smart contract mechanisms and governance decisions.</p>
              </div>
            )}
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="text-sm">{`Price: $${payload[0].value}`}</p>
                        <p className="text-xs text-gray-500">Click for more details</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
            <Button key={tf} variant={timeframe === tf ? "default" : "outline"} onClick={() => setTimeframe(tf)}>
              {tf}
            </Button>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={() => toggleSection("historical")}>View Historical Comparison</Button>
          {expandedSection === "historical" && (
            <div className="mt-2">
              <p>Historical data comparison feature will be displayed here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

