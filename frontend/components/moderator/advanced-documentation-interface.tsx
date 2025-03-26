"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BookOpen, Sparkles } from "lucide-react"
import { ContentModerationFeatures } from "./content-moderation-features"
import { DocumentationHeader } from "./documentation-header"
import { EnhancedDocumentationSidebar } from "./enhanced-documentation-sidebar"
import { AdvancedEditor } from "./advanced-editor"
import { DocumentationWorkflowTools } from "./documentation-workflow-tools"
import { VisualStructureMap } from "./visual-structure-map"

export function AdvancedDocumentationInterface() {
  const [activeTab, setActiveTab] = useState("editor")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timer)
    }
  }, [])

  // Apply parallax effect based on mouse position
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const moveX = (mousePosition.x - centerX) / 50
    const moveY = (mousePosition.y - centerY) / 50

    const elements = container.querySelectorAll(".parallax-bg")
    elements.forEach((el) => {
      const depth = Number.parseFloat(el.getAttribute("data-depth") || "0.1")
      ;(el as HTMLElement).style.transform = `translate(${moveX * depth}px, ${moveY * depth}px)`
    })
  }, [mousePosition])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-950 to-purple-950 text-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-2 border-indigo-500 rounded-full animate-spin mb-6"></div>
          <h2 className="text-xl font-semibold mb-2 glow-text">Loading Documentation Interface</h2>
          <p className="text-indigo-300">Preparing your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex h-screen bg-gradient-to-br from-indigo-950 to-purple-950 text-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 parallax-bg" data-depth="0.2">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-indigo-600 filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-purple-600 filter blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-blue-600 filter blur-2xl"></div>
        </div>
      </div>

      <EnhancedDocumentationSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DocumentationHeader />
        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6 bg-indigo-900/30 border border-indigo-500/30 glass-panel">
              <TabsTrigger
                value="editor"
                className="data-[state=active]:white/50 transition-all duration-300 animated-button"
              >
                Editor
              </TabsTrigger>
              <TabsTrigger
                value="workflow"
                className="data-[state=active]:white/50 transition-all duration-300 animated-button"
              >
                Workflow
              </TabsTrigger>
              <TabsTrigger
                value="moderation"
                className="data-[state=active]:white/50 transition-all duration-300 animated-button"
              >
                Moderation
              </TabsTrigger>
              <TabsTrigger
                value="structure"
                className="data-[state=active]:white/50 transition-all duration-300 animated-button"
              >
                Structure
              </TabsTrigger>
            </TabsList>

            <div className="transition-all duration-500 ease-in-out">
              <TabsContent value="editor" className="mt-0">
                <AdvancedEditor />
              </TabsContent>
              <TabsContent value="workflow" className="mt-0">
                <DocumentationWorkflowTools />
              </TabsContent>
              <TabsContent value="moderation" className="mt-0">
                <ContentModerationFeatures />
              </TabsContent>
              <TabsContent value="structure" className="mt-0">
                <VisualStructureMap />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Floating action button */}
      <div className="absolute bottom-6 right-6">
        <Button className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 p-0 shadow-lg animated-button">
          <Sparkles className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

function DocumentSection({ title, children, level = 1, active = false }) {
  const [expanded, setExpanded] = useState(active)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-all duration-300 ${
          active ? "bg-indigo-700/30" : isHovered ? "bg-indigo-800/30" : ""
        }`}
        style={{ paddingLeft: `${(level - 1) * 1}rem` }}
        onClick={() => setExpanded(!expanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`h-2 w-2 rounded-full transition-all duration-300 ${
            active ? "bg-indigo-500" : isHovered ? "bg-indigo-400" : "bg-indigo-400/50"
          }`}
        ></div>
        <span
          className={`text-sm transition-all duration-300 ${active ? "font-medium" : ""} ${
            isHovered ? "translate-x-0.5" : ""
          }`}
        >
          {title}
        </span>
        {children && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`ml-auto transition-transform duration-300 ${expanded ? "transform rotate-90" : ""}`}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        )}
      </div>

      {children && (
        <div
          className={`ml-2 mt-1 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
            expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function RelatedDocument({ title }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer transition-all duration-300 ${
        isHovered ? "bg-indigo-800/30 translate-x-0.5" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BookOpen
        className={`h-4 w-4 transition-all duration-300 ${isHovered ? "text-indigo-300 scale-110" : "text-indigo-400"}`}
      />
      <span className="text-sm">{title}</span>
    </div>
  )
}

function DocumentHistory() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium glow-text">Version History</h3>

        <div className="space-y-4">
          <HistoryItem
            version="2.3"
            author="Alex Morgan"
            date="Today, 2:45 PM"
            changes={["Updated security principles", "Added accessibility guidelines", "Fixed typos"]}
            current={true}
          />
          <HistoryItem
            version="2.2"
            author="Jamie Chen"
            date="Mar 5, 2023"
            changes={["Added API authentication section", "Updated code examples"]}
          />
          <HistoryItem
            version="2.1"
            author="Taylor Kim"
            date="Feb 28, 2023"
            changes={["Restructured document", "Added best practices section"]}
          />
          <HistoryItem
            version="2.0"
            author="Alex Morgan"
            date="Feb 15, 2023"
            changes={["Major revision", "Updated all sections", "New formatting"]}
          />
          <HistoryItem version="1.0" author="Jamie Chen" date="Jan 10, 2023" changes={["Initial document creation"]} />
        </div>
      </div>
    </div>
  )
}

function HistoryItem({ version, author, date, changes, current = false }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`p-4 rounded-lg border transition-all duration-300 ${
        current ? "bg-indigo-800/30 border-indigo-500/50" : "bg-indigo-900/30 border-indigo-500/30"
      } ${isHovered ? "transform scale-[1.01] shadow-lg" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Version {version}</span>
            {current && <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded">Current</span>}
          </div>
          <div className="text-sm text-indigo-300">
            {author} • {date}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-indigo-300 hover:text-white hover:bg-indigo-700/30 animated-button"
          >
            View
          </Button>
          {!current && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-indigo-300 hover:text-white hover:bg-indigo-700/30 animated-button"
            >
              Restore
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1 mt-3">
        <div className="text-sm font-medium">Changes:</div>
        <ul className="space-y-1">
          {changes.map((change, index) => (
            <li key={index} className="text-sm flex items-start gap-2">
              <span className="text-indigo-400">•</span>
              <span>{change}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

