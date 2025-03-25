"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Info } from "lucide-react"

const historicalData = [
  { month: "Jan", users: 1000, courses: 50, tokenPrice: 1.0 },
  { month: "Feb", users: 1200, courses: 55, tokenPrice: 1.1 },
  { month: "Mar", users: 1500, courses: 60, tokenPrice: 1.2 },
  { month: "Apr", users: 1800, courses: 65, tokenPrice: 1.3 },
  { month: "May", users: 2200, courses: 70, tokenPrice: 1.5 },
  { month: "Jun", users: 2600, courses: 75, tokenPrice: 1.8 },
]

const projectedData = [
  { month: "Jul", users: 3000, courses: 80, tokenPrice: 2.0 },
  { month: "Aug", users: 3500, courses: 85, tokenPrice: 2.2 },
  { month: "Sep", users: 4000, courses: 90, tokenPrice: 2.4 },
  { month: "Oct", users: 4500, courses: 95, tokenPrice: 2.6 },
  { month: "Nov", users: 5000, courses: 100, tokenPrice: 2.8 },
  { month: "Dec", users: 5500, courses: 105, tokenPrice: 3.0 },
]

export function PlatformMetricsContext() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [showProjections, setShowProjections] = useState(false)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const data = showProjections ? [...historicalData, ...projectedData] : historicalData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Metrics & Growth Projections</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold">Total Users</p>
                <p className="text-2xl">{data[data.length - 1].users.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-semibold">Available Courses</p>
                <p className="text-2xl">{data[data.length - 1].courses}</p>
              </div>
              <div>
                <p className="font-semibold">Token Price</p>
                <p className="text-2xl">${data[data.length - 1].tokenPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Growth Trends</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" name="Users" />
                  <Line yAxisId="left" type="monotone" dataKey="courses" stroke="#82ca9d" name="Courses" />
                  <Line yAxisId="right" type="monotone" dataKey="tokenPrice" stroke="#ffc658" name="Token Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-between">
              <Button variant="outline" onClick={() => setShowProjections(!showProjections)}>
                {showProjections ? "Hide Projections" : "Show Projections"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toggleSection("methodology")}>
                <Info className="mr-2 h-4 w-4" /> Projection Methodology
              </Button>
            </div>
            {expandedSection === "methodology" && (
              <div className="mt-2 text-sm">
                <p>
                  Our projections are based on historical growth rates, market analysis, and planned platform
                  improvements. They consider factors such as marketing efforts, new course additions, and anticipated
                  token utility enhancements.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Growth Drivers</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Expansion of course offerings</li>
              <li>Increased token utility within the platform</li>
              <li>Community-driven content creation incentives</li>
              <li>Strategic partnerships with educational institutions</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("drivers")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "drivers" && (
              <div className="mt-2 text-sm">
                <p>
                  These growth drivers are key components of our strategic plan to expand the platform's reach and
                  enhance the value proposition for users and token holders alike.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Risk Factors</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Regulatory changes in the crypto education space</li>
              <li>Competition from traditional online learning platforms</li>
              <li>Technological advancements requiring platform upgrades</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("risks")}>
              <Info className="mr-2 h-4 w-4" /> Risk Mitigation Strategies
            </Button>
            {expandedSection === "risks" && (
              <div className="mt-2 text-sm">
                <p>
                  We actively monitor these risk factors and have developed comprehensive strategies to mitigate their
                  potential impact on our growth trajectory and token ecosystem.
                </p>
              </div>
            )}
          </div>

          <Button className="w-full">Download Detailed Metrics Report</Button>
        </div>
      </CardContent>
    </Card>
  )
}

