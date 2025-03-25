"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronDown,
  List,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Share,
  Clock,
  BookOpen,
  Users,
  Star,
  GitPullRequest,
  Eye,
  LinkIcon,
  Search,
  Copy,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/contexts/theme-context"
import { useDocContext } from "./enhanced-documentation-layout"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { cn } from "@/lib/utils"
import { documentationService } from "@/services/api"

export function EnhancedDocRightPanel() {
  const { theme } = useTheme()
  const {
    activeSection,
    scrollProgress,
    bookmarkedSections,
    readSections,
    expandedSections,
    toggleSectionExpansion,
    viewMode,
    setCursorVariant,
    readingProgress,
    setReadingProgress,
  } = useDocContext()
  const { selectedDocumentation, selectedSection } = useDocumentationStore()
  const [isClient, setIsClient] = useState(false)
  const [expandedPanels, setExpandedPanels] = useState<string[]>(["tableOfContents", "relatedDocs"])
  const [feedbackGiven, setFeedbackGiven] = useState<"helpful" | "unhelpful" | null>(null)
  const [feedbackComment, setFeedbackComment] = useState<string>("")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)
  const [searchFilter, setSearchFilter] = useState<string>("")
  const [readingTime, setReadingTime] = useState(0)
  const progressRef = useRef<number>(0)

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Try to restore expanded panels from local storage
    try {
      const savedPanels = localStorage.getItem("doc-right-panel-expanded")
      if (savedPanels) {
        setExpandedPanels(JSON.parse(savedPanels))
      }
    } catch (error) {
      console.error("Failed to restore expanded right panel sections:", error)
    }
  }, [])

  // Save expanded panels to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-right-panel-expanded", JSON.stringify(expandedPanels))
      } catch (error) {
        console.error("Failed to save expanded right panel sections:", error)
      }
    }
  }, [expandedPanels, isClient])

  // Toggle panel expansion
  const togglePanel = (panelId: string) => {
    setExpandedPanels((prev) => (prev.includes(panelId) ? prev.filter((id) => id !== panelId) : [...prev, panelId]))
  }

  // Handle feedback submission
  const submitFeedback = () => {
    console.log("Feedback submitted:", { type: feedbackGiven, comment: feedbackComment })
    setShowFeedbackForm(false)
    // In a real implementation, this would send the feedback to a server
  }

  // Filter table of contents based on search
  const filterTableOfContents = (sections: { id: string; label: string }[]) => {
    if (!searchFilter) return sections

    return sections.filter((section) => section.label.toLowerCase().includes(searchFilter.toLowerCase()))
  }

  // Fetch the reading time when documentation changes
  useEffect(() => {
    if (selectedDocumentation?.id) {
      documentationService.getDocumentationReadingTime(selectedDocumentation.id)
        .then(response => {
          if (response.data && response.data.data) {
            setReadingTime(response.data.data.readingTimeMinutes || 1)
          }
        })
        .catch(error => {
          console.error("Error fetching reading time:", error)
          setReadingTime(5) // Default to 5 minutes if fetch fails
        })
    }
  }, [selectedDocumentation?.id])

  // Calculate and update reading progress on scroll
  useEffect(() => {
    const calculateReadingProgress = () => {
      // Get the content element - make sure to target the right container
      const contentElement = document.querySelector('.documentation-content') || document.getElementById('contentRef')
      if (!contentElement) return
      
      const windowHeight = window.innerHeight
      const docHeight = contentElement.scrollHeight
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const totalScrollable = docHeight - windowHeight
      
      // Calculate progress percentage (0-100)
      let progress = totalScrollable > 0 ? (scrollY / totalScrollable) * 100 : 0
      
      // Make sure progress is within bounds
      progress = Math.min(100, Math.max(0, progress))
      
      // Round to nearest integer
      progress = Math.round(progress)
      
      // Only update if progress has changed
      if (progress !== progressRef.current) {
        progressRef.current = progress
        setReadingProgress(progress / 100) // Convert to 0-1 scale for context
        
        // Debug info
        console.log(`Scroll progress updated: ${progress}%, docHeight: ${docHeight}, windowHeight: ${windowHeight}, scrollY: ${scrollY}`)
      }
    }
    
    // Initial calculation
    setTimeout(calculateReadingProgress, 500) // Small delay to ensure content is rendered
    
    // Add scroll listener
    window.addEventListener('scroll', calculateReadingProgress, { passive: true })
    
    // Add resize listener (recalculate on window resize)
    window.addEventListener('resize', calculateReadingProgress, { passive: true })
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', calculateReadingProgress)
      window.removeEventListener('resize', calculateReadingProgress)
    }
  }, [setReadingProgress, selectedDocumentation?.id])

  if (!isClient) {
    return null
  }

  // If in focused mode, hide the right panel
  if (viewMode === "focused") {
    return null
  }

  // Table of contents sections
  const tableOfContentsSections = [
    { id: "introduction", label: "Introduction" },
    { id: "installation", label: "Installation" },
    { id: "environment-setup", label: "Environment Setup" },
    { id: "quick-start", label: "Quick Start Guide" },
    { id: "component-structure", label: "Component Structure" },
    { id: "architecture", label: "Architecture Overview" },
  ]

  // Related documents
  const relatedDocs = [
    {
      id: "core-concepts",
      label: "Core Concepts",
      description: "Understanding the fundamentals",
      isNew: false,
    },
    {
      id: "api-reference",
      label: "API Reference",
      description: "Detailed API documentation",
      isNew: true,
    },
    {
      id: "tutorials",
      label: "Tutorials",
      description: "Step-by-step guides",
      isNew: false,
    },
  ]

  // Contributors
  const contributors = [
    { id: "user1", initials: "JD", color: "bg-primary/20" },
    { id: "user2", initials: "MK", color: "bg-blue-500/20" },
    { id: "user3", initials: "TS", color: "bg-green-500/20" },
    { id: "user4", initials: "AL", color: "bg-yellow-500/20" },
    { id: "user5", initials: "RB", color: "bg-purple-500/20" },
  ]

  // Animation variants
  const panelVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }

  // Render the reading progress section with the current value
  const renderReadingProgress = () => {
    // Convert the reading progress to percentage (0-100)
    const progressPercentage = Math.round(readingProgress * 100)
    
    return (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          READING PROGRESS
        </h3>
        <div className="h-2 bg-accent/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${progressPercentage}%` }}
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{readingTime > 0 ? `${readingTime} min read` : 'Quick read'}</span>
          <span>{progressPercentage}% {progressPercentage === 100 ? 'Completed' : 'In progress'}</span>
        </div>
      </div>
    )
  }

  return (
    <aside className="hidden lg:block w-72 border-l border-border bg-background/30 backdrop-blur-sm">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4 space-y-6">
          {/* Table of contents */}
          <Collapsible
            open={expandedPanels.includes("tableOfContents")}
            onOpenChange={() => togglePanel("tableOfContents")}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">ON THIS PAGE</h3>
              </div>

            </div>


          </Collapsible>

          {/* Reading progress */}
          {renderReadingProgress()}

          <Separator />

          {/* Related documents */}
          <Collapsible open={expandedPanels.includes("relatedDocs")} onOpenChange={() => togglePanel("relatedDocs")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">RELATED DOCUMENTS</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <motion.div
                    animate={{ rotate: expandedPanels.includes("relatedDocs") ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </Button>
              </CollapsibleTrigger>
            </div>

            <AnimatePresence>
              {expandedPanels.includes("relatedDocs") && (
                <CollapsibleContent forceMount asChild>
                  <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="space-y-3 mt-2">
                      {relatedDocs.map((doc) => (
                        <motion.a
                          key={doc.id}
                          href={`#${doc.id}`}
                          className="block p-3 bg-card rounded-md border border-border hover:bg-accent/10 transition-colors relative"
                          whileHover={{ x: 4 }}
                          onMouseEnter={() => setCursorVariant("link")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium text-sm">{doc.label}</h4>
                            {doc.isNew && (
                              <Badge
                                variant="outline"
                                className="text-[0.6rem] h-4 px-1 border-green-500 text-green-500 font-medium"
                              >
                                NEW
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>


          <Separator />

          {/* Feedback */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              FEEDBACK
            </h3>

            {feedbackGiven ? (
              <div className="text-sm text-center py-2">
                <p className="text-green-500 font-medium">Thank you for your feedback!</p>
                <p className="text-xs text-muted-foreground mt-1">Your input helps us improve our documentation.</p>
              </div>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-2">Was this page helpful?</div>
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setFeedbackGiven("helpful")
                            setShowFeedbackForm(true)
                          }}
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>This page was helpful</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setFeedbackGiven("unhelpful")
                            setShowFeedbackForm(true)
                          }}
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>This page needs improvement</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setShowFeedbackForm(true)}
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Leave feedback</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <Share className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Share this page</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <AnimatePresence>
                  {showFeedbackForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <textarea
                        placeholder="Tell us more about your experience..."
                        className="w-full h-24 p-2 text-sm rounded-md border border-border bg-background resize-none"
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        onMouseEnter={() => setCursorVariant("text")}
                        onMouseLeave={() => setCursorVariant("default")}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowFeedbackForm(false)}
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={submitFeedback}
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          Submit
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Contributors */}
          <Collapsible open={expandedPanels.includes("contributors")} onOpenChange={() => togglePanel("contributors")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">CONTRIBUTORS</h3>
              </div>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <motion.div
                    animate={{ rotate: expandedPanels.includes("contributors") ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </Button>
              </CollapsibleTrigger>
            </div>

            <AnimatePresence>
              {expandedPanels.includes("contributors") && (
                <CollapsibleContent forceMount asChild>
                  <motion.div variants={panelVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="mt-2">
                      <div className="flex -space-x-2 mb-2">
                        {contributors.map((contributor, index) => (
                          <motion.div
                            key={contributor.id}
                            className={`w-8 h-8 rounded-full ${contributor.color} flex items-center justify-center text-xs font-medium border-2 border-background`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -2, zIndex: 10 }}
                          >
                            {contributor.initials}
                          </motion.div>
                        ))}
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Last edited by JD</span>
                        <span>2 days ago</span>
                      </div>

                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex-1 gap-1"
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <Star className="h-3 w-3" />
                          <span>Star</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs flex-1 gap-1"
                          onMouseEnter={() => setCursorVariant("button")}
                          onMouseLeave={() => setCursorVariant("default")}
                        >
                          <GitPullRequest className="h-3 w-3" />
                          <span>Fork</span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </CollapsibleContent>
              )}
            </AnimatePresence>
          </Collapsible>

          {/* Permanent link */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              PERMANENT LINK
            </h3>
            <div className="flex items-center gap-2 text-black">
              <Input
                value="https://devdocs.example.com/getting-started"
                readOnly
                className="h-8 text-xs"
                onMouseEnter={() => setCursorVariant("text")}
                onMouseLeave={() => setCursorVariant("default")}
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText("https://devdocs.example.com/getting-started")
                      }}
                      onMouseEnter={() => setCursorVariant("copy")}
                      onMouseLeave={() => setCursorVariant("default")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Copy link</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

// Simple check icon component
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

