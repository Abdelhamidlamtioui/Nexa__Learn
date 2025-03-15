"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const proposals = [
  { id: 1, title: "Increase staking rewards", votes: 1500, status: "Active" },
  { id: 2, title: "Add new course category", votes: 1200, status: "Active" },
  { id: 3, title: "Reduce transaction fees", votes: 1800, status: "Closed" },
]

export function GovernanceSection() {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle>Governance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Active Proposals</h4>
            <ul className="space-y-2">
              {proposals.map((proposal) => (
                <li key={proposal.id} className="flex justify-between items-center">
                  <span>{proposal.title}</span>
                  <span>{proposal.votes} votes</span>
                  <span
                    className={`px-2 py-1 rounded ${proposal.status === "Active" ? "bg-green-500" : "bg-gray-500"} text-white`}
                  >
                    {proposal.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Your Voting Power</h4>
            <p>1,500 ELP</p>
          </div>
          <Button className="w-full">Create Proposal</Button>
        </div>
      </CardContent>
    </Card>
  )
}

