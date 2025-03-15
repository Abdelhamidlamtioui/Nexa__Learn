"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Info } from "lucide-react"

const data = [
  { name: "Platform Reserve", value: 30 },
  { name: "Team & Advisors", value: 15 },
  { name: "Community Rewards", value: 25 },
  { name: "Public Sale", value: 20 },
  { name: "Liquidity Pool", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function TokenDistributionDetails() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Token Distribution Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ResponsiveContainer width="100%" height={300}>
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
          <div>
            <h3 className="text-xl font-semibold mb-4">Allocation Details</h3>
            {data.map((item) => (
              <div key={item.name} className="mb-4">
                <h4 className="font-semibold">{item.name}</h4>
                <p>{item.value}% of total supply</p>
                <Button variant="ghost" size="sm" onClick={() => toggleSection(item.name)}>
                  <Info className="mr-2 h-4 w-4" /> Learn More
                </Button>
                {expandedSection === item.name && (
                  <div className="mt-2 text-sm">
                    {item.name === "Platform Reserve" && (
                      <>
                        <p>Smart Contract: 0x1234...5678</p>
                        <p>Vesting: 4-year linear vesting</p>
                        <p>Usage: Platform development, marketing, partnerships</p>
                      </>
                    )}
                    {item.name === "Team & Advisors" && (
                      <>
                        <p>1-year cliff, 4-year linear vesting</p>
                        <p>Monthly sell limit: 1% of total allocation</p>
                      </>
                    )}
                    {item.name === "Community Rewards" && (
                      <>
                        <p>Distributed over 5 years</p>
                        <p>Used for staking rewards, content creation incentives</p>
                      </>
                    )}
                    {item.name === "Public Sale" && (
                      <>
                        <p>25% unlocked at TGE</p>
                        <p>75% vested over 6 months</p>
                      </>
                    )}
                    {item.name === "Liquidity Pool" && (
                      <>
                        <p>Locked for 2 years</p>
                        <p>Used to provide initial DEX liquidity</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

