"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, ArrowDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const generateMarketData = (length: number) => {
  return Array.from({ length }, (_, i) => ({
    time: i,
    TT: Math.random() * 10 + 90,
    IC: Math.random() * 5 + 45,
    DC: Math.random() * 15 + 135,
    CS: Math.random() * 2 + 8,
  }))
}

export function CurrencyMarketOverview() {
  const [marketData, setMarketData] = useState(generateMarketData(30))

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData((prev) => [
        ...prev.slice(1),
        {
          time: prev[prev.length - 1].time + 1,
          TT: prev[prev.length - 1].TT + (Math.random() - 0.5) * 2,
          IC: prev[prev.length - 1].IC + (Math.random() - 0.5),
          DC: prev[prev.length - 1].DC + (Math.random() - 0.5) * 3,
          CS: prev[prev.length - 1].CS + (Math.random() - 0.5) * 0.4,
        },
      ])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const currencies = [
    {
      name: "Tech Tokens (TT)",
      value: marketData[marketData.length - 1].TT.toFixed(2),
      change: "+2.5%",
      status: "Bullish",
    },
    {
      name: "Innovation Coins (IC)",
      value: marketData[marketData.length - 1].IC.toFixed(2),
      change: "-1.2%",
      status: "Active Trading",
    },
    {
      name: "Dev Credits (DC)",
      value: marketData[marketData.length - 1].DC.toFixed(2),
      change: "+3.7%",
      status: "High Demand",
    },
    {
      name: "Community Stars (CS)",
      value: marketData[marketData.length - 1].CS.toFixed(2),
      change: "+0.8%",
      status: "Steady",
    },
  ]

  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Currency Market Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white bg-opacity-10 text-white">
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="TT" stroke="#8884d8" />
                <Line type="monotone" dataKey="IC" stroke="#82ca9d" />
                <Line type="monotone" dataKey="DC" stroke="#ffc658" />
                <Line type="monotone" dataKey="CS" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white bg-opacity-10 text-white">
          <CardHeader>
            <CardTitle>Currency Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currencies.map((currency, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-bold">{currency.name}</p>
                    <p>{currency.value}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={currency.change.startsWith("+") ? "default" : "destructive"} className="mb-1">
                      {currency.change.startsWith("+") ? (
                        <ArrowUp className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 mr-1" />
                      )}
                      {currency.change}
                    </Badge>
                    <p>{currency.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

