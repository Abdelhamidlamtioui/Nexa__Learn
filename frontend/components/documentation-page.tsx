"use client"

import { useState, useEffect } from "react"
import { ForumHeader } from "@/components/forum-header"
import { DocumentationHeader } from "@/components/documentation-header"
import { DocumentationSidebar } from "@/components/documentation-sidebar"
import { DocumentationContent } from "@/components/documentation-content"
import { DocumentationRightSidebar } from "@/components/documentation-right-sidebar"
import { AIAssistant } from "@/components/ai-assistant"
import { MobileNavigation } from "@/components/mobile-navigation"

export function DocumentationPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mediaQuery.matches)
    mediaQuery.addEventListener("change", () => setReducedMotion(mediaQuery.matches))

    return () => {
      window.removeEventListener("resize", checkMobile)
      mediaQuery.removeEventListener("change", () => setReducedMotion(mediaQuery.matches))
    }
  }, [])

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""} ${reducedMotion ? "reduced-motion" : ""}`}>
      <ForumHeader />
      <DocumentationHeader darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex-grow flex">
        {!isMobile && <DocumentationSidebar />}
        <main className="flex-grow p-6 overflow-y-auto">
          <DocumentationContent />
        </main>
        {!isMobile && <DocumentationRightSidebar />}
      </div>
      <AIAssistant />
      {isMobile && <MobileNavigation />}
    </div>
  )
}

