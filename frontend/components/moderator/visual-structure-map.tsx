"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FolderTree, Plus, Trash2 } from "lucide-react"

export function VisualStructureMap() {
  return (
    <div className="space-y-6">
      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <FolderTree className="h-5 w-5 mr-2 text-indigo-400" />
            Document Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-indigo-900/30 border-indigo-500/30 text-indigo-300 hover:bg-indigo-800/50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="space-y-4">
            <DocumentSection title="Introduction" level={1} wordCount={250} status="complete" />

            <DocumentSection title="Core Principles" level={1} wordCount={850} status="complete">
              <DocumentSection title="User-Centric Design" level={2} wordCount={320} status="complete" />
              <DocumentSection title="Accessibility" level={2} wordCount={280} status="complete" />
              <DocumentSection title="Security and Privacy" level={2} wordCount={250} status="in-progress" />
            </DocumentSection>

            <DocumentSection title="Implementation Guidelines" level={1} wordCount={1200} status="in-progress">
              <DocumentSection title="Frontend Standards" level={2} wordCount={450} status="complete" />
              <DocumentSection title="Backend Architecture" level={2} wordCount={380} status="in-progress" />
              <DocumentSection title="API Design" level={2} wordCount={370} status="in-progress" />
            </DocumentSection>

            <DocumentSection title="Best Practices" level={1} wordCount={0} status="not-started" />

            <DocumentSection title="Resources" level={1} wordCount={0} status="not-started" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-indigo-900/20 border-indigo-500/30 text-white">
        <CardHeader className="bg-indigo-900/30 border-b border-indigo-500/30">
          <CardTitle className="text-lg flex items-center">
            <FileText className="h-5 w-5 mr-2 text-indigo-400" />
            Document Relationships
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex justify-center">
            <div className="relative w-full h-64 bg-indigo-950/50 rounded-lg border border-indigo-500/30 p-4">
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-700/50 rounded-lg p-3 border border-indigo-500/50 z-10">
                <div className="text-sm font-medium text-center">Platform Guidelines</div>
              </div>

              <RelationshipNode title="API Documentation" position="top-left" />
              <RelationshipNode title="Security Guidelines" position="top-right" />
              <RelationshipNode title="User Experience" position="bottom-left" />
              <RelationshipNode title="Accessibility Standards" position="bottom-right" />

              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#6366f1" strokeWidth="1" strokeDasharray="4" />
                <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#6366f1" strokeWidth="1" strokeDasharray="4" />
                <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="#6366f1" strokeWidth="1" strokeDasharray="4" />
                <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#6366f1" strokeWidth="1" strokeDasharray="4" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DocumentSection({ title, level = 1, wordCount, status, children }) {
  const [expanded, setExpanded] = useState(true)

  const getStatusColor = (status) => {
    switch (status) {
      case "complete":
        return "bg-green-500"
      case "in-progress":
        return "bg-yellow-500"
      case "not-started":
        return "bg-indigo-500/50"
      default:
        return "bg-indigo-500/50"
    }
  }

  return (
    <div>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-md hover:bg-indigo-800/30 cursor-pointer ${level === 1 ? "bg-indigo-900/30" : ""}`}
        style={{ marginLeft: `${(level - 1) * 1.5}rem` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div className={`h-3 w-3 rounded-full ${getStatusColor(status)}`}></div>

        <div className="flex-1">
          <div className="flex items-center">
            <span className={`${level === 1 ? "font-medium" : ""}`}>{title}</span>
            <span className="text-xs text-indigo-400 ml-2">({wordCount} words)</span>
          </div>

          {status === "in-progress" && (
            <div className="h-1 w-24 bg-indigo-900/50 rounded-full mt-1">
              <div className="h-1 bg-yellow-500 rounded-full" style={{ width: "60%" }}></div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-indigo-400 hover:text-white hover:bg-indigo-700/30"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-indigo-400 hover:text-white hover:bg-indigo-700/30"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
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
              className={`transition-transform ${expanded ? "transform rotate-90" : ""}`}
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          )}
        </div>
      </div>

      {children && expanded && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  )
}

function RelationshipNode({ title, position }) {
  const getPosition = (pos) => {
    switch (pos) {
      case "top-left":
        return "left-[25%] top-[25%] -translate-x-1/2 -translate-y-1/2"
      case "top-right":
        return "left-[75%] top-[25%] -translate-x-1/2 -translate-y-1/2"
      case "bottom-left":
        return "left-[25%] top-[75%] -translate-x-1/2 -translate-y-1/2"
      case "bottom-right":
        return "left-[75%] top-[75%] -translate-x-1/2 -translate-y-1/2"
      default:
        return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  return (
    <div
      className={`absolute transform ${getPosition(position)} bg-indigo-600/50 rounded-lg p-2 border border-indigo-500/50`}
    >
      <div className="text-xs text-center">{title}</div>
    </div>
  )
}

