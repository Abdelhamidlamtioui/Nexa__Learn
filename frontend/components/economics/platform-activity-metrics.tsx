"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", users: 4000, courses: 2400, content: 2400 },
  { name: "Tue", users: 3000, courses: 1398, content: 2210 },
  { name: "Wed", users: 2000, courses: 9800, content: 2290 },
  { name: "Thu", users: 2780, courses: 3908, content: 2000 },
  { name: "Fri", users: 1890, courses: 4800, content: 2181 },
  { name: "Sat", users: 2390, courses: 3800, content: 2500 },
  { name: "Sun", users: 3490, courses: 4300, content: 2100 },
]

export function PlatformActivityMetrics() {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Platform Activity Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
              <Bar dataKey="courses" fill="#82ca9d" />
              <Bar dataKey="content" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

