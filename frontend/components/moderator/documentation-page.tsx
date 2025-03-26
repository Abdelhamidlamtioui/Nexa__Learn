"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { ModeratorHeader } from "@/components/moderator/moderator-header"
import { ModeratorSidebar } from "@/components/moderator/moderator-sidebar"
import { ContentModerationGuidelines } from "@/components/moderator/content-moderation-guidelines"
import { TokenEconomyManagement } from "@/components/moderator/token-economy-management"
import { UserManagementTools } from "@/components/moderator/user-management-tools"
import { BadgeCertificationReview } from "@/components/moderator/badge-certification-review"
import { DocumentationContributionReview } from "@/components/moderator/documentation-contribution-review"
import { InteractiveElements } from "@/components/moderator/interactive-elements"

export function ModeratorDocumentationPage() {
  const [activeSection, setActiveSection] = useState("content-moderation")

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#663399] text-white">
      <ForumHeader />
      <div className="flex">
        <ModeratorSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1 p-6">
          <ModeratorHeader />
          <div className="mt-6">
            {activeSection === "content-moderation" && <ContentModerationGuidelines />}
            {activeSection === "token-economy" && <TokenEconomyManagement />}
            {activeSection === "user-management" && <UserManagementTools />}
            {activeSection === "badge-certification" && <BadgeCertificationReview />}
            {activeSection === "documentation-contribution" && <DocumentationContributionReview />}
          </div>
          <InteractiveElements />
        </main>
      </div>
    </div>
  )
}

