import { ForumHeader } from "@/components/forum-header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedLearningPaths } from "@/components/home/featured-learning-paths"
import { TopContributors } from "@/components/home/top-contributors"
import { LatestActivityFeed } from "@/components/home/latest-activity-feed"
import { ResourcesSection } from "@/components/home/resources-section"
import { CurrencyMarketOverview } from "@/components/home/currency-market-overview"
import { CommunityHighlights } from "@/components/home/community-highlights"
import { QuickAccessTools } from "@/components/home/quick-access-tools"
import { AchievementShowcase } from "@/components/home/achievement-showcase"
import { CallToAction } from "@/components/home/call-to-action"
import { GlobalElements } from "@/components/home/global-elements"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ForumHeader />
      <main className="flex-grow">
        <HeroSection />
        <div className="container mx-auto px-4 space-y-16 py-16">
          <FeaturedLearningPaths />
          <TopContributors />
          <LatestActivityFeed />
          <ResourcesSection />
          <CurrencyMarketOverview />
          <CommunityHighlights />
          <QuickAccessTools />
          <AchievementShowcase />
          <CallToAction />
        </div>
      </main>
      <GlobalElements />
    </div>
  )
}

