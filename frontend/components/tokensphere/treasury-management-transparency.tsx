"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { Info } from "lucide-react"

const treasuryData = [
  { name: "Liquidity Reserves", value: 5000000 },
  { name: "Development Fund", value: 3000000 },
  { name: "Community Grants", value: 1500000 },
  { name: "Operational Expenses", value: 500000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function TreasuryManagementTransparency() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const totalTreasury = treasuryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Treasury Management Transparency</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Treasury Overview</h3>
            <p>Total Treasury Value: ${totalTreasury.toLocaleString()}</p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={treasuryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
                  >
                    {treasuryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Treasury Policies</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Maintain at least 50% of treasury in liquidity reserves</li>
              <li>Allocate 20% annually to development initiatives</li>
              <li>Community grants capped at 10% of treasury per year</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("policies")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "policies" && (
              <div className="mt-2 text-sm">
                <p>
                  These policies ensure long-term sustainability and growth of the ecosystem while maintaining
                  sufficient liquidity and supporting community initiatives.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Recent Treasury Activities</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Allocated $500,000 to new DeFi integration project</li>
              <li>Distributed $100,000 in community grants</li>
              <li>Increased liquidity pool by $1,000,000</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("activities")}>
              <Info className="mr-2 h-4 w-4" /> View All Activities
            </Button>
            {expandedSection === "activities" && (
              <div className="mt-2 text-sm">
                <p>
                  A complete log of all treasury activities is available for review, ensuring full transparency in the
                  use of funds.
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Treasury Governance</h3>
            <p>Major treasury decisions require community vote</p>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("governance")}>
              <Info className="mr-2 h-4 w-4" /> Governance Process
            </Button>
            {expandedSection === "governance" && (
              <div className="mt-2 text-sm">
                <p>
                  Proposals for significant treasury allocations or policy changes must go through a community voting
                  process, requiring a 66% majority to pass.
                </p>
              </div>
            )}
          </div>

          <Button className="w-full">View Detailed Treasury Report</Button>
        </div>
      </CardContent>
    </Card>
  )
}

