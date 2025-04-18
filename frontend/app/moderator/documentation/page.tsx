"use client"

import { ForumHeader } from "@/components/forum-header"
import { DocumentationPortal } from "@/components/moderator/documentation-portal"
import { AdminGuard } from "@/components/guards/AdminGuard"
import {ModeratorGuard} from "@/components/guards/ModeratorGuard";

export default function ModeratorDocumentationPage() {
  return (
    <ModeratorGuard>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0F172A] to-[#0284C7] text-white">
        <ForumHeader />
        <div className="flex-grow">
          <DocumentationPortal />
        </div>
      </div>
    </ModeratorGuard>
  )
}

