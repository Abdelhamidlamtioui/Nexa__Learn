"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Buy-back Fund", value: 1000000 },
  { name: "Development Fund", value: 2000000 },
  { name: "Community Rewards", value: 1500000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"]

export function TreasuryManagement() {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Treasury Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Treasury Allocation</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Recent Transactions</h4>
            <ul className="space-y-2">
              <li>Buy-back: 10,000 ELP ($20,000)</li>
              <li>Development: $50,000 allocated</li>
              <li>Rewards Distribution: 5,000 ELP</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

