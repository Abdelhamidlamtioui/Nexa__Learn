"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Info } from "lucide-react"

export function GovernanceFrameworkDisplay() {
  const [tokenHolding, setTokenHolding] = useState("")
  const [stakingDuration, setStakingDuration] = useState("")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const calculateVotingPower = () => {
    const tokens = Number.parseFloat(tokenHolding) || 0
    const months = Number.parseFloat(stakingDuration) || 0
    const baseVotingPower = tokens
    const stakingBonus = tokens * (months / 12) * 0.1 // 10% bonus per year of staking
    return (baseVotingPower + stakingBonus).toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Governance Framework</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Voting Power Calculator</h3>
            <div className="space-y-2">
              <Input
                type="number"
                value={tokenHolding}
                onChange={(e) => setTokenHolding(e.target.value)}
                placeholder="Enter token holding"
              />
              <Input
                type="number"
                value={stakingDuration}
                onChange={(e) => setStakingDuration(e.target.value)}
                placeholder="Enter staking duration (months)"
              />
              <p>Estimated Voting Power: {calculateVotingPower()} VP</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("votingPower")}>
              <Info className="mr-2 h-4 w-4" /> Learn More
            </Button>
            {expandedSection === "votingPower" && (
              <div className="mt-2 text-sm">
                <p>
                  Voting power is calculated based on token holding and staking duration. Longer staking periods provide
                  bonus voting power.
                </p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Active Proposals</h3>
            <ul className="space-y-2">
              <li>
                <p>Increase staking rewards</p>
                <Progress value={75} className="mt-1" />
                <span className="text-sm">75% in favor</span>
              </li>
              <li>
                <p>Add new course category</p>
                <Progress value={60} className="mt-1" />
                <span className="text-sm">60% in favor</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Governance Process</h3>
            <ol className="list-decimal list-inside space-y-1">
              <li>Proposal Submission</li>
              <li>Community Discussion (7 days)</li>
              <li>Voting Period (5 days)</li>
              <li>Implementation (if passed)</li>
            </ol>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("governanceProcess")}>
              <Info className="mr-2 h-4 w-4" /> Detailed Explanation
            </Button>
            {expandedSection === "governanceProcess" && (
              <div className="mt-2 text-sm">
                <p>
                  The governance process ensures community involvement in decision-making. Proposals require a minimum
                  of 100,000 VP to be submitted and need a 66% majority to pass.
                </p>
              </div>
            )}
          </div>
          <Button className="w-full">Create New Proposal</Button>
        </div>
      </CardContent>
    </Card>
  )
}

