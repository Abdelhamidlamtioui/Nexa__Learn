"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { TokenOverviewPanel } from "@/components/economics/token-overview-panel"
import { TokenDistributionSection } from "@/components/economics/token-distribution-section"
import { StakingInterface } from "@/components/economics/staking-interface"
import { PlatformActivityMetrics } from "@/components/economics/platform-activity-metrics"
import { GovernanceSection } from "@/components/economics/governance-section"
import { TradingControlsPanel } from "@/components/economics/trading-controls-panel"
import { TreasuryManagement } from "@/components/economics/treasury-management"
import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EconomicsDashboard() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <header className="bg-gradient-to-r from-deep-navy to-rich-purple text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold font-heading">ELP Economics</h1>
          <div className="flex items-center space-x-4">
            <span>$ELP: $1.23 (+5.67%)</span>
            <span>Wallet: 0x1234...5678</span>
            <select className="bg-transparent border border-white rounded">
              <option>EN | USD</option>
              <option>ES | EUR</option>
            </select>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-white hover:text-pink-400"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>
      <ForumHeader />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
        <TokenOverviewPanel />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TokenDistributionSection />
          <StakingInterface />
        </div>
        <PlatformActivityMetrics />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GovernanceSection />
          <TradingControlsPanel />
        </div>
        <TreasuryManagement />
      </main>
    </div>
  )
}

