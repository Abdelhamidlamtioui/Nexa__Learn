"use client"

import { useState, useEffect, useRef, createContext, useContext } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValueEvent } from "framer-motion"
import { useTheme } from "@/contexts/theme-context"
import {
  Search,
  BookOpen,
  Star,
  Sun,
  Moon,
  Menu,
  X,
  BookMarked,
  Clock,
  Settings,
  ChevronRight,
  Lightbulb,
  Zap,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EnhancedDocSidebar } from "./enhanced-doc-sidebar"
import { EnhancedDocContent } from "./enhanced-doc-content"
import { EnhancedDocRightPanel } from "./enhanced-doc-right-panel"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import {useDocumentationStore} from "@/stores/useDocumentationStore";
import Link from "next/link";

// Documentation context for sharing state between components
type DocContextType = {
  activeSection: string
  setActiveSection: (section: string) => void
  activePath: string[]
  setActivePath: (path: string[]) => void
  bookmarkedSections: string[]
  toggleBookmark: (sectionId: string) => void
  readSections: string[]
  markSectionAsRead: (sectionId: string) => void
  expandedSections: string[]
  toggleSectionExpansion: (sectionId: string) => void
  viewMode: "default" | "focused" | "presentation"
  setViewMode: (mode: "default" | "focused" | "presentation") => void
  scrollProgress: number
  setScrollProgress: (progress: number) => void
  isSearchOpen: boolean
  setIsSearchOpen: (isOpen: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  cursorVariant: "default" | "link" | "text" | "button" | "copy"
  setCursorVariant: (variant: "default" | "link" | "text" | "button" | "copy") => void
  useStandardScrolling: boolean
  readingProgress: number
  setReadingProgress: (progress: number) => void
}

const DocContext = createContext<DocContextType | undefined>(undefined)

export const useDocContext = () => {
  const context = useContext(DocContext)
  if (!context) {
    throw new Error("useDocContext must be used within a DocContextProvider")
  }
  return context
}

// Near the top of the file, update the CSS to make all text black in light mode
const lightModeTextStyle = `
  .documentation-container.light-mode {
    --text-primary: #000000;
    --text-secondary: #000000;
    --text-muted: #000000;
    color: var(--text-primary);
  }
  
  .documentation-container.light-mode .text-foreground {
    color: var(--text-primary) !important;
  }
  
  .documentation-container.light-mode .text-muted-foreground {
    color: var(--text-primary) !important;
  }

  /* Force black text for all elements in light mode */
  .documentation-container.light-mode p,
  .documentation-container.light-mode span,
  .documentation-container.light-mode div,
  .documentation-container.light-mode a,
  .documentation-container.light-mode button,
  .documentation-container.light-mode label {
    color: #000000;
  }
`;

// Add these styles near the top of your component
const performanceStyles = `
  <style>
    /* Enable hardware acceleration */
    .documentation-container {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
      will-change: transform;
    }

    /* Reduce paint operations during scroll */
    .documentation-content * {
      backface-visibility: hidden;
      -webkit-font-smoothing: subpixel-antialiased;
    }

    /* Optimize fixed elements */
    .sticky {
      will-change: transform;
      transform: translateZ(0);
    }

    /* Reduce repaints for animated elements */
    .animated-element {
      will-change: transform, opacity;
    }
  </style>
`;

export function EnhancedDocumentationLayout() {
  const [isClient, setIsClient] = useState(false)
  const { theme, toggleTheme, setIsDocumentation } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("introduction")
  const [activePath, setActivePath] = useState<string[]>(["getting-started", "introduction"])
  const [bookmarkedSections, setBookmarkedSections] = useState<string[]>([])
  const [readSections, setReadSections] = useState<string[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>(["overview"])
  const [viewMode, setViewMode] = useState<"default" | "focused" | "presentation">("default")
  const [cursorVariant, setCursorVariant] = useState<"default" | "link" | "text" | "button" | "copy">("default")
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [showCustomCursor, setShowCustomCursor] = useState(false)
  const useStandardScrolling = true
  const [readingProgress, setReadingProgress] = useState(0)
  const [showNoDocMessage, setShowNoDocMessage] = useState(true)

  const mainRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: mainRef,
    offset: ["start start", "end end"],
  })

  // Smooth scroll progress for animations
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.01
  })

  // Background animation based on scroll - make it more subtle
  const backgroundOpacity = useTransform(smoothScrollProgress, [0, 1], [0.05, 0.1])
  const backgroundSize = useTransform(smoothScrollProgress, [0, 1], ["100%", "102%"])
  const backgroundPosition = useTransform(smoothScrollProgress, [0, 1], ["0% 0%", "1% 1%"])

  // Update reading progress as user scrolls - keep this functionality but make it less intrusive
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Only update when significant changes occur to reduce re-renders
    if (Math.abs(latest - scrollProgress) > 0.01) {
      setScrollProgress(latest)
    }
  })

  // Toggle bookmark
  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Mark section as read
  const markSectionAsRead = (sectionId: string) => {
    if (!readSections.includes(sectionId)) {
      setReadSections((prev) => [...prev, sectionId])
    }
  }

  // Toggle section expansion
  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    )
  }

  // Handle resize for mobile detection
  useEffect(() => {
    setIsClient(true)

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    // Try to restore state from localStorage
    try {
      const savedBookmarks = localStorage.getItem("doc-bookmarked-sections")
      if (savedBookmarks) {
        setBookmarkedSections(JSON.parse(savedBookmarks))
      }

      const savedReadSections = localStorage.getItem("doc-read-sections")
      if (savedReadSections) {
        setReadSections(JSON.parse(savedReadSections))
      }

      const savedExpandedSections = localStorage.getItem("doc-expanded-sections")
      if (savedExpandedSections) {
        setExpandedSections(JSON.parse(savedExpandedSections))
      }

      const savedViewMode = localStorage.getItem("doc-view-mode")
      if (savedViewMode) {
        setViewMode(JSON.parse(savedViewMode))
      }
    } catch (error) {
      console.error("Failed to restore state from localStorage:", error)
    }

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Save state to localStorage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-bookmarked-sections", JSON.stringify(bookmarkedSections))
        localStorage.setItem("doc-read-sections", JSON.stringify(readSections))
        localStorage.setItem("doc-expanded-sections", JSON.stringify(expandedSections))
        localStorage.setItem("doc-view-mode", JSON.stringify(viewMode))
      } catch (error) {
        console.error("Failed to save state to localStorage:", error)
      }
    }
  }, [bookmarkedSections, readSections, expandedSections, viewMode, isClient])

  // Custom cursor effect
  useEffect(() => {
    if (!isClient) return

    const updateCursorPosition = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseEnter = () => {
      setShowCustomCursor(true)
    }

    const handleMouseLeave = () => {
      setShowCustomCursor(false)
    }

    window.addEventListener("mousemove", updateCursorPosition)
    document.body.addEventListener("mouseenter", handleMouseEnter)
    document.body.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updateCursorPosition)
      document.body.removeEventListener("mouseenter", handleMouseEnter)
      document.body.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [isClient])

  // Disable custom cursor on mobile
  useEffect(() => {
    if (isMobile) {
      setShowCustomCursor(false)
    }
  }, [isMobile])

  // Add the style to the document head when the component mounts
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = lightModeTextStyle;
    document.head.appendChild(styleElement);
    
    return () => {
      // Clean up when the component unmounts
      document.head.removeChild(styleElement);
    }
  }, []);

  // At the top of your component, get the selected items from the store
  const { selectedDocumentation, selectedSection, setSelectedDocumentation, setSelectedSection } = useDocumentationStore();

  // Mark that we're in documentation mode
  useEffect(() => {
    setIsDocumentation(true)
    
    return () => {
      // Clean up when leaving documentation
      setIsDocumentation(false)
    }
  }, [setIsDocumentation])

  // Then add this effect to reset the message when a document is selected
  useEffect(() => {
    // If there's a selected document, hide the message
    if (selectedDocumentation) {
      setShowNoDocMessage(false);
    } else {
      // If no document is selected, show the message
      setShowNoDocMessage(true);
    }
  }, [selectedDocumentation]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Custom cursor variants
  const cursorVariants = {
    default: {
      width: 32,
      height: 32,
      backgroundColor: "rgba(var(--primary-rgb), 0.2)",
      border: "2px solid rgba(var(--primary-rgb), 0.5)",
      x: cursorPosition.x - 16,
      y: cursorPosition.y - 16,
    },
    link: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(var(--primary-rgb), 0.3)",
      border: "2px solid rgba(var(--primary-rgb), 0.8)",
      x: cursorPosition.x - 20,
      y: cursorPosition.y - 20,
    },
    button: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(var(--primary-rgb), 0.4)",
      border: "2px solid rgba(var(--primary-rgb), 1)",
      x: cursorPosition.x - 24,
      y: cursorPosition.y - 24,
    },
    text: {
      width: 8,
      height: 32,
      backgroundColor: "rgba(var(--primary-rgb), 0.8)",
      border: "none",
      x: cursorPosition.x - 4,
      y: cursorPosition.y - 16,
    },
    copy: {
      width: 36,
      height: 36,
      backgroundColor: "rgba(var(--primary-rgb), 0.3)",
      border: "2px solid rgba(var(--primary-rgb), 0.8)",
      x: cursorPosition.x - 18,
      y: cursorPosition.y - 18,
    },
  }

  // Optimize motion animations by disabling them on scroll
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: 0.05,
      },
    },
  };

  return (
    <DocContext.Provider
      value={{
        activeSection,
        setActiveSection,
        activePath,
        setActivePath,
        bookmarkedSections,
        toggleBookmark,
        readSections,
        markSectionAsRead,
        expandedSections,
        toggleSectionExpansion,
        viewMode,
        setViewMode,
        scrollProgress,
        setScrollProgress,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        cursorVariant,
        setCursorVariant,
        useStandardScrolling,
        readingProgress,
        setReadingProgress,
      }}
    >
      <div
        className={`documentation-container min-h-screen ${viewMode === "focused" ? "focused-mode" : ""} standard-scroll ${theme === "dark" ? "" : "light-mode"}`}
      >
        {/* Custom cursor */}
        {showCustomCursor && !isMobile && (
          <motion.div
            ref={cursorRef}
            className="fixed top-0 left-0 rounded-full pointer-events-none z-50 mix-blend-difference"
            variants={cursorVariants}
            animate={cursorVariant}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 28,
              mass: 0.5,
            }}
          />
        )}

        {/* Animated background */}
        <motion.div
          className={`fixed inset-0 z-[-1] bg-gradient-radial ${
            theme === "dark" ? "from-background to-accent/10" : "from-background to-accent/20"
          }`}
          style={{
            opacity: backgroundOpacity,
            backgroundSize,
            backgroundPosition,
          }}
        />

        {/* Subtle background pattern */}
        <div
          className={`fixed inset-0 z-[-2] opacity-[0.03] pointer-events-none ${theme === "dark" ? "invert" : ""}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%239C92AC' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Navigation bar */}
        <header
          className={cn(
            "sticky top-0 z-20 w-full backdrop-blur-md border-b border-border",
            theme === "dark" 
              ? "bg-background/80 text-foreground" 
              : "bg-background/80 text-black",
            viewMode === "focused" && "opacity-0 pointer-events-none",
          )}
        >
          <div className="container mx-auto px-4 h-16">
            {/* Change to grid layout with three columns */}
            <div className="grid grid-cols-3 h-full items-center">
              {/* Left section - Logo */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onMouseEnter={() => setCursorVariant("link")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("link")}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <a
                  href="/dev-forum"
                  className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  onMouseEnter={() => setCursorVariant("link")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <BookOpen className="h-6 w-6 text-primary" />
                  <span className="font-bold text-xl hidden md:inline-block">DevDocs</span>
                </a>
              </motion.div>

              {/* Center section - Breadcrumb */}
              <motion.div
                className="hidden md:flex items-center justify-center space-x-2 max-w-2xl overflow-hidden"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link 
                  href="/" 
                  className={cn("text-sm transition-colors shrink-0",
                    theme === "dark" ? "text-muted-foreground hover:text-foreground" : "text-black hover:text-black"
                  )}
                >
                  Home
                </Link>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <a
                  href="/dev-forum/documentation"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    // Clear any selected documentation
                    setSelectedDocumentation(null);
                    setSelectedSection(null);
                    // Show the "no document selected" message
                    setShowNoDocMessage(true);
                  }}
                  className={cn("text-sm transition-colors shrink-0",
                    theme === "dark" ? "text-muted-foreground hover:text-foreground" : "text-black hover:text-black"
                  )}>
                  Documentation
                </a>

                {/* Selected documentation and section with tooltips */}
                {selectedDocumentation && (
                  <>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium truncate max-w-[150px] cursor-help">
                            {selectedDocumentation.technology?.replace(/_/g, " ")}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[300px]">
                          <p>{selectedDocumentation.technology?.replace(/_/g, " ")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium truncate max-w-[200px] cursor-help">
                            {selectedDocumentation.title}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[300px]">
                          <p>{selectedDocumentation.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}

                {/*{selectedSection && (
                  <>
                    <ChevronRight className="h-4 w-4 shrink-0" />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-sm font-medium truncate max-w-[200px] cursor-help">
                            {selectedSection.title}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[300px]">
                          <p>{selectedSection.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}*/}
              </motion.div>

              {/* Right section - Actions */}
              <motion.div
                className="flex items-center justify-end space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Search className="h-5 w-5" />
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="transition-transform hover:scale-110 active:scale-95"
                        onMouseEnter={() => setCursorVariant("button")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Switch to {theme === "dark" ? "light" : "dark"} mode</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                        onMouseEnter={() => setCursorVariant("button")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        <BookMarked className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Your bookmarks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                        onMouseEnter={() => setCursorVariant("button")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        <Clock className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Reading history</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex transition-transform hover:scale-110 active:scale-95"
                        onClick={() => setViewMode(viewMode === "focused" ? "default" : "focused")}
                        onMouseEnter={() => setCursorVariant("button")}
                        onMouseLeave={() => setCursorVariant("default")}
                      >
                        {viewMode === "focused" ? <Settings className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{viewMode === "focused" ? "Exit focused mode" : "Enter focused mode"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Button
                  className="hidden md:flex gap-2 items-center transition-all hover:shadow-md active:scale-95"
                  onMouseEnter={() => setCursorVariant("button")}
                  onMouseLeave={() => setCursorVariant("default")}
                >
                  <Star className="h-4 w-4" />
                  <span>Contribute</span>
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Reading progress bar - sticks with header */}
          <div className="w-full h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${readingProgress * 100}%` }}
            />
          </div>
        </header>

        {/* Main content */}
        <div className="container mx-auto px-0 flex flex-col md:flex-row">
          <SidebarProvider
            className={theme === "dark" ? "" : "text-black"}
          >
            <EnhancedDocSidebar />
            <main
              ref={mainRef}
              className={cn(
                "flex-1 min-h-[calc(100vh-4rem)] pt-6 pb-20 md:px-8 transition-all duration-500",
                theme === "dark" ? "text-foreground" : "text-black",
                viewMode === "focused" && "md:px-16 lg:px-32",
              )}
            >
              {showNoDocMessage && !selectedDocumentation && (
                <div className="flex flex-col items-center justify-center h-full p-8 -mt-32">
                  <div className="text-center max-w-md transform translate-y-[-40%]">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-2xl font-bold mb-2">No document selected</h2>
                    <p className="text-muted-foreground mb-6">
                      Select a document from the sidebar to view its content.
                    </p>
                    <div className="animate-bounce mt-6">
                      <ChevronLeft className="h-6 w-6 text-primary inline-block" />
                      <span className="mx-2 text-primary">Browse documents</span>
                    </div>
                  </div>
                </div>
              )}
              {selectedDocumentation && (
                <EnhancedDocContent />
              )}
            </main>
            {viewMode !== "focused" && <EnhancedDocRightPanel />}
          </SidebarProvider>
        </div>

        {/* Quick actions floating button (visible in focused mode) */}
        {viewMode === "focused" && (
          <motion.div
            className="fixed bottom-6 right-6 z-40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg"
                    onClick={() => setViewMode("default")}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <Zap className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Exit focused mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}

        <div dangerouslySetInnerHTML={{ __html: performanceStyles }} />
      </div>
    </DocContext.Provider>
  )
}

