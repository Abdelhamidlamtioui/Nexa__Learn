"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"

export function StakingInformationPanel() {
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("3")
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const calculateRewards = () => {
    const principal = Number.parseFloat(amount) || 0
    const months = Number.parseInt(duration)
    const apy = months === 3 ? 0.1 : months === 6 ? 0.15 : 0.2
    return (principal * apy * (months / 12)).toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staking Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Amount to Stake</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter ELP amount"
            />
          </div>
          <div>
            <label className="block mb-1">Lock Period</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 months (10% APY)</SelectItem>
                <SelectItem value="6">6 months (15% APY)</SelectItem>
                <SelectItem value="12">12 months (20% APY)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h4 className="font-semibold">Projected Rewards</h4>
            <p>{calculateRewards()} ELP</p>
            <Button variant="ghost" size="sm" onClick={() => toggleSection("apyCalculation")}>
              <Info className="mr-2 h-4 w-4" /> APY Calculation
            </Button>
            {expandedSection === "apyCalculation" && (
              <div className="mt-2 text-sm">
                <p>
                  APY is calculated based on the lock period and current network statistics. Longer lock periods offer
                  higher APY rates.
                </p>
              </div>
            )}
          </div>
          <Button className="w-full">Stake ELP</Button>
        </div>
        <div className="mt-4">
          <Button variant="outline" onClick={() => toggleSection("stakingStats")}>
            View Historical Staking Statistics
          </Button>
          {expandedSection === "stakingStats" && (
            <div className="mt-2">
              <p>Historical staking data and performance metrics will be displayed here.</p>
            </div>
          )}
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Staking FAQ</h4>
          <ul className="list-disc list-inside text-sm">
            <li>What is staking?</li>
            <li>How are rewards calculated?</li>
            <li>Can I unstake early?</li>
            <li>Are there any risks involved?</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

