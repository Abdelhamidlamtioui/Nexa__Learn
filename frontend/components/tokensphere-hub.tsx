"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { TokenOverviewEnhanced } from "@/components/tokensphere/token-overview-enhanced"
import { TokenDistributionDetails } from "@/components/tokensphere/token-distribution-details"
import { StakingInformationPanel } from "@/components/tokensphere/staking-information-panel"
import { GovernanceFrameworkDisplay } from "@/components/tokensphere/governance-framework-display"
import { TradingControlsDocumentation } from "@/components/tokensphere/trading-controls-documentation"
import { TreasuryManagementTransparency } from "@/components/tokensphere/treasury-management-transparency"
import { PlatformMetricsContext } from "@/components/tokensphere/platform-metrics-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TokensphereHub() {
  const [activeTab, setActiveTab] = useState("token-economics")

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-deep-navy to-rich-purple text-white">
      <ForumHeader />
      <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Tokensphere: Economics Hub</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="token-economics">Token Economics</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="rewards">Reward Systems</TabsTrigger>
            <TabsTrigger value="trading">Trading Rules</TabsTrigger>
            <TabsTrigger value="projections">Growth Projections</TabsTrigger>
            <TabsTrigger value="risk">Risk Management</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          <TabsContent value="token-economics">
            <Card>
              <CardHeader>
                <CardTitle>Token Economics</CardTitle>
              </CardHeader>
              <CardContent>
                <TokenOverviewEnhanced />
                <TokenDistributionDetails />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="governance">
            <Card>
              <CardHeader>
                <CardTitle>Governance Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <GovernanceFrameworkDisplay />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rewards">
            <Card>
              <CardHeader>
                <CardTitle>Reward Systems</CardTitle>
              </CardHeader>
              <CardContent>
                <StakingInformationPanel />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trading">
            <Card>
              <CardHeader>
                <CardTitle>Trading Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <TradingControlsDocumentation />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="projections">
            <Card>
              <CardHeader>
                <CardTitle>Growth Projections</CardTitle>
              </CardHeader>
              <CardContent>
                <PlatformMetricsContext />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle>Risk Management</CardTitle>
              </CardHeader>
              <CardContent>
                <TreasuryManagementTransparency />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documentation">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <h2 className="text-2xl font-semibold mb-4">Comprehensive Documentation</h2>
                <p>Detailed explanations, guides, and resources for all aspects of the ELP token ecosystem.</p>
                {/* Add links or embed documentation here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

