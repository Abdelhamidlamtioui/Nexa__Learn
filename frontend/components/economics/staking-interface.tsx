"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function StakingInterface() {
  const [amount, setAmount] = useState("")
  const [duration, setDuration] = useState("3")

  const calculateRewards = () => {
    const principal = Number.parseFloat(amount) || 0
    const months = Number.parseInt(duration)
    const apy = months === 3 ? 0.1 : months === 6 ? 0.15 : 0.2
    return (principal * apy * (months / 12)).toFixed(2)
  }

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Staking</CardTitle>
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
          </div>
          <Button className="w-full">Stake ELP</Button>
        </div>
      </CardContent>
    </Card>
  )
}

