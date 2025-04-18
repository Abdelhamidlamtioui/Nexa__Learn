import { ForumHeader } from "@/components/forum-header"
import { PricingContent } from "@/components/pricing-content"

export function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-blue-900 to-cyan-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ForumHeader />
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-8">
          Pricing Plans & Currency System
        </h1>
        <PricingContent />
      </main>
    </div>
  )
}

