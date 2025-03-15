"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", price: 1.2 },
  { name: "Feb", price: 1.5 },
  { name: "Mar", price: 1.8 },
  { name: "Apr", price: 1.6 },
  { name: "May", price: 2.0 },
  { name: "Jun", price: 2.2 },
]

export function TokenOverviewPanel() {
  const [timeframe, setTimeframe] = useState("1M")

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Token Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold">$2.20</h3>
            <p className="text-sm text-green-500">+10% (24h)</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Market Cap</h3>
            <p>$220,000,000</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Circulating Supply</h3>
            <p>100,000,000 ELP</p>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          {["1D", "1W", "1M", "3M", "1Y", "ALL"].map((tf) => (
            <button
              key={tf}
              className={`px-2 py-1 rounded ${timeframe === tf ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

