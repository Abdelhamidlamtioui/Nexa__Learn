"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Platform Reserve", value: 30 },
  { name: "Team & Advisors", value: 15 },
  { name: "Community Rewards", value: 25 },
  { name: "Public Sale", value: 20 },
  { name: "Liquidity Pool", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function TokenDistributionSection() {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Token Distribution</CardTitle>
      </CardHeader>
      <CardContent>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Vesting Schedule</h4>
          <ul className="list-disc list-inside">
            <li>Team & Advisors: 4-year linear vesting</li>
            <li>Community Rewards: Released over 5 years</li>
            <li>Public Sale: 25% at TGE, 25% every 6 months</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

