"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion"
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Bookmark,
  BookmarkCheck,
  Play,
  Info,
  AlertTriangle,
  CheckCircle,
  LinkIcon,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Maximize,
  Minimize,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "@/contexts/theme-context"
import { useDocContext } from "./enhanced-documentation-layout"
import { cn } from "@/lib/utils"
import type React from "react"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { DocumentationDTO, DocumentationSectionDTO } from "@/app/types/documentation"
import { documentationService } from "@/services/api"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import CodeBlock from "@tiptap/extension-code-block"
import { EnhancedEditorStyles } from "../moderator/enhanced-editor-styles"

// Sample code for demo purposes
const sampleCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default Counter;`

// Sample diagram data
const diagramData = {
  nodes: [
    { id: "app", label: "Application", x: 50, y: 20 },
    { id: "ui", label: "UI Layer", x: 20, y: 50 },
    { id: "service", label: "Service Layer", x: 50, y: 50 },
    { id: "data", label: "Data Layer", x: 80, y: 50 },
    { id: "api", label: "API", x: 50, y: 80 },
  ],
  edges: [
    { from: "app", to: "ui" },
    { from: "app", to: "service" },
    { from: "app", to: "data" },
    { from: "ui", to: "service" },
    { from: "service", to: "data" },
    { from: "data", to: "api" },
  ],
}

// Create a read-only version of the TipTap editor for displaying content
function ReadOnlyTipTapContent({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false)
  
  // Create a read-only editor instance with the same extensions as your edit mode
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable CodeBlock to prevent conflicts
        codeBlock: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-indigo-950 text-indigo-300 p-4 rounded-md font-mono text-sm my-4 overflow-x-auto",
        },
      }),
    ],
    content,
    editable: false, // This makes it read-only
    // Fix SSR issues
    immediatelyRender: false,
  }, [])
  
  // Handle client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  // Update content when it changes
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])
  
  if (!isMounted) {
    return <div className="h-6 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md"></div>
  }
  
  // ENHANCED custom styles with stronger overrides to prevent background flashes
  const customStyles = `
    <style>
      /* Force dark theme everywhere in the editor */
      .enhanced-editor, 
      .enhanced-editor *,
      .ProseMirror,
      .ProseMirror *,
      .glass-panel,
      .glass-panel * {
        transition: none !important;
        color-scheme: dark !important;
        background-color: transparent !important;
      }
      
      /* Ensure background never changes on any state */
      .ProseMirror,
      .ProseMirror:hover,
      .ProseMirror:focus,
      .ProseMirror:active,
      .ProseMirror::selection,
      .ProseMirror *:hover,
      .ProseMirror *:focus,
      .ProseMirror *:active {
        background-color: transparent !important;
        cursor: default !important;
      }
      
      /* Force the glass panel to maintain a dark transparent background */
      .glass-panel {
        background-color: rgba(15, 23, 42, 0.3) !important;
        backdrop-filter: blur(4px) !important;
        box-shadow: none !important;
      }
      
      .glass-panel:hover {
        background-color: rgba(15, 23, 42, 0.3) !important;
      }
      
      /* Fix code blocks to maintain their styling */
      pre {
        background: rgb(30 27 75) !important;
      }
      
      /* Force light text color for proper contrast */
      .prose {
        color: #f8fafc !important;
        max-width: none !important;
      }
      
      /* Additional fixes for specific elements */
      h1, h2, h3, h4, h5, h6 {
        color: #f1f5f9 !important;
      }
      
      p, li, blockquote {
        color: #e2e8f0 !important;
      }
      
      /* Prevent any selection styling */
      ::selection {
        background-color: rgba(79, 70, 229, 0.2) !important;
      }
    </style>
  `
  
  // Render the TipTap editor in read-only mode with enhanced custom styles
  return (
    <div className="enhanced-editor read-only-editor dark">
      <EnhancedEditorStyles />
      <div dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div 
        className="glass-panel rounded-md overflow-hidden" 
        style={{ 
          background: 'rgba(15, 23, 42, 0.3)',
          boxShadow: 'none'
        }}
      >
        {editor ? (
          <EditorContent 
            editor={editor} 
            className="prose prose-invert max-w-none p-4"
          />
        ) : (
          <div className="flex items-center justify-center p-4">
            <div className="w-6 h-6 border-t-2 border-indigo-500 rounded-full animate-spin mr-2"></div>
            <span>Loading content...</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Implement a lighter-weight fallback for when TipTap has issues
function FallbackHtmlContent({ content }: { content: string }) {
  return (
    <div className="glass-panel rounded-md overflow-hidden prose prose-invert max-w-none p-4"
         style={{ background: 'rgba(15, 23, 42, 0.3)' }}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// Conditional rendering component that tries TipTap first, falls back to simpler rendering
function ContentDisplay({ content }: { content: string }) {
  const [useFallback, setUseFallback] = useState(false);
  
  useEffect(() => {
    // If we see too many TipTap errors, switch to fallback
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes('Tiptap Error')) {
        setUseFallback(true);
      }
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (useFallback) {
    return <FallbackHtmlContent content={content} />;
  }
  
  return <ReadOnlyTipTapContent content={content} />;
}

// Add throttle utility at the top of the file
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

export function EnhancedDocContent() {
  const { theme, setTheme } = useTheme()
  const {
    activeSection,
    setActiveSection,
    bookmarkedSections,
    toggleBookmark,
    markSectionAsRead,
    expandedSections,
    toggleSectionExpansion,
    viewMode,
    setCursorVariant,
    useStandardScrolling,
    readingProgress,
    setReadingProgress,
  } = useDocContext()

  const [isClient, setIsClient] = useState(false)
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({})
  const [expandedCodeBlocks, setExpandedCodeBlocks] = useState<string[]>([])
  const [activeCodeTab, setActiveCodeTab] = useState("preview")
  const [diagramHover, setDiagramHover] = useState<string | null>(null)
  const [readingTime, setReadingTime] = useState(5)

  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Add a new state to track scrolling activity
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null)

  // Get scroll progress for animations
  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ["start start", "end end"],
  })

  // Transform values for parallax effects - make them more subtle if standard scrolling is enabled
  const titleY = useTransform(scrollYProgress, [0, 0.1], useStandardScrolling ? [0, 0] : [0, -10])
  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], useStandardScrolling ? [1, 1, 1] : [1, 0.8, 0])

  // Add this near the top of the file where other state is declared
  const [localReadingProgress, setLocalReadingProgress] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const progressBarTimeout = useRef<NodeJS.Timeout | null>(null);

  // Get selected documentation from store
  const { selectedDocumentation, selectedSection } = useDocumentationStore();

  // Add these new states
  const [isMounted, setIsMounted] = useState(false)

  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize component
  useEffect(() => {
    setIsClient(true)
    setIsLoading(false)
  }, [])

  // Add error handler for content loading
  useEffect(() => {
    if (selectedDocumentation) {
      setHasError(false);
      try {
        // Verify content exists
        if (!selectedDocumentation.content && !selectedDocumentation.sections?.length) {
          console.warn('No content available for selected documentation');
          setHasError(true);
        }
      } catch (error) {
        console.error('Error loading documentation content:', error);
        setHasError(true);
      }
    }
  }, [selectedDocumentation]);

  // Update reading time when documentation changes
  useEffect(() => {
    if (selectedDocumentation?.id) {
      // Fetch reading time from API
      documentationService.getDocumentationReadingTime(selectedDocumentation.id)
        .then(response => {
          setReadingTime(response.data.data.readingTimeMinutes);
        })
        .catch(error => console.error('Error fetching reading time:', error));
    }
  }, [selectedDocumentation?.id]);

  // Set dark theme as default for documentation on initial load
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('doctech-theme')
    
    // Only set to dark if no theme has been set yet
    if (!storedTheme) {
      localStorage.setItem('doctech-theme', 'dark')
      
      // If setTheme function is available in the context, use it
      if (setTheme) {
        setTheme('dark')
      }
      
      // Add dark class to document root for immediate effect
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    }
  }, [setTheme])

  // Update the useEffect that handles scroll events
  useEffect(() => {
    if (!contentRef.current) return;

    // Throttled scroll handler
    const handleScroll = throttle(() => {
      if (!contentRef.current) return;

      const scrollTop = window.scrollY;
      const scrollHeight = contentRef.current.scrollHeight;
      const clientHeight = window.innerHeight;

      const progress = scrollTop / (scrollHeight - clientHeight);
      setReadingProgress(Math.min(Math.max(progress, 0), 1));
    }, 100); // Update every 100ms instead of every scroll event

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [setReadingProgress]);

  // Optimize intersection observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-100px 0px -60% 0px",
      threshold: [0, 0.1, 0.5, 1], // Reduce number of calculations
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.id) {
          setActiveSection(entry.target.id);
          markSectionAsRead(entry.target.id);
        }
      });
    }, observerOptions);

    // Use requestIdleCallback to defer non-critical work
    requestIdleCallback(() => {
      document.querySelectorAll("section[id]").forEach((section) => {
        observer.observe(section);
        sectionRefs.current[section.id] = section as HTMLElement;
      });
    });

    return () => observer.disconnect();
  }, [setActiveSection, markSectionAsRead]);

  // Toggle code block expansion
  const toggleCodeBlockExpansion = (blockId: string) => {
    setExpandedCodeBlocks((prev) => (prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]))
  }

  // Copy code to clipboard
  const copyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedStates({ ...copiedStates, [id]: true })
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [id]: false })
    }, 2000)
  }

  // Simulate running code
  const runCode = (id: string) => {
    console.log(`Running code ${id}`)
    // In a real implementation, this would actually execute the code
  }

  // Scroll to section with animation
  const scrollToSection = (sectionId: string) => {
    const section = sectionRefs.current[sectionId]
    if (section) {
      const yOffset = -80 // Header height + some padding
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({
        top: y,
        behavior: useStandardScrolling ? "auto" : "smooth",
      })
    }
  }

  // Code block component with animations and expandable view
  const CodeBlock = ({
    id,
    language = "javascript",
    code,
    filename,
    showLineNumbers = true,
  }: {
    id: string
    language: string
    code: string
    filename?: string
    showLineNumbers?: boolean
  }) => {
    const isExpanded = expandedCodeBlocks.includes(id)
    const blockRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(blockRef, { once: true, amount: 0.2 })

    return (
      <motion.div
        ref={blockRef}
        className={cn(
          "relative mt-4 mb-6 rounded-lg overflow-hidden border border-border transition-all duration-300",
          theme === "dark" ? "bg-zinc-900" : "bg-zinc-50",
          isExpanded && "scale-[1.02] shadow-xl z-10",
        )}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      >
        {filename && (
          <div
            className={`px-4 py-2 text-xs font-mono border-b border-border ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-100"}`}
          >
            {filename}
          </div>
        )}
        <div className="relative">
          <pre
            className={cn(
              "p-4 overflow-x-auto text-sm font-mono transition-all duration-300",
              theme === "dark" ? "text-zinc-200" : "text-zinc-700",
              isExpanded && "max-h-[80vh] overflow-y-auto",
            )}
          >
            <code>
              {code.split("\n").map((line, i) => (
                <div key={i} className="line">
                  {showLineNumbers && (
                    <span className="inline-block w-8 text-right mr-4 text-muted-foreground select-none">{i + 1}</span>
                  )}
                  {line || " "}
                </div>
              ))}
            </code>
          </pre>
          <div className="absolute top-2 right-2 flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleCodeBlockExpansion(id)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    {isExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isExpanded ? "Collapse" : "Expand"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => runCode(id)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("button")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Run code</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyCode(id, code)}
                    className={`h-8 w-8 rounded-md transition-all ${theme === "dark" ? "hover:bg-zinc-800" : "hover:bg-zinc-200"}`}
                    onMouseEnter={() => setCursorVariant("copy")}
                    onMouseLeave={() => setCursorVariant("default")}
                  >
                    {copiedStates[id] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{copiedStates[id] ? "Copied!" : "Copy code"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </motion.div>
    )
  }

  // Interactive diagram component
  const InteractiveDiagram = () => {
    return (
      <motion.div
        className={cn(
          "relative my-8 p-6 rounded-lg border border-border transition-all duration-300",
          theme === "dark" ? "bg-background/50" : "bg-background/80",
        )}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
        onMouseEnter={() => setCursorVariant("link")}
        onMouseLeave={() => setCursorVariant("default")}
      >
        <h4 className="text-center font-medium mb-4">Architecture Diagram</h4>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="overflow-visible">
            {/* Draw edges first so they appear behind nodes */}
            {diagramData.edges.map((edge, index) => {
              const fromNode = diagramData.nodes.find((n) => n.id === edge.from)
              const toNode = diagramData.nodes.find((n) => n.id === edge.to)

              if (!fromNode || !toNode) return null

              const isHighlighted = diagramHover === edge.from || diagramHover === edge.to

              return (
                <motion.line
                  key={`edge-${index}`}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={theme === "dark" ? "#666" : "#999"}
                  strokeWidth={isHighlighted ? 3 : 1.5}
                  strokeOpacity={isHighlighted ? 1 : 0.6}
                  strokeDasharray={isHighlighted ? "none" : "4,2"}
                  initial={useStandardScrolling ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={useStandardScrolling ? { duration: 0 } : { duration: 1, delay: index * 0.1 }}
                />
              )
            })}

            {/* Draw nodes on top of edges */}
            {diagramData.nodes.map((node) => (
              <g key={node.id}>
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r={diagramHover === node.id ? 6 : 5}
                  fill={
                    diagramHover === node.id
                      ? theme === "dark"
                        ? "#818cf8"
                        : "#4f46e5"
                      : theme === "dark"
                        ? "#475569"
                        : "#cbd5e1"
                  }
                  stroke={theme === "dark" ? "#1e293b" : "#f8fafc"}
                  strokeWidth={1.5}
                  initial={useStandardScrolling ? { scale: 1 } : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={
                    useStandardScrolling
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 300, damping: 25, delay: node.id.length * 0.1 }
                  }
                  onMouseEnter={() => setDiagramHover(node.id)}
                  onMouseLeave={() => setDiagramHover(null)}
                  style={{ cursor: "pointer" }}
                />
                <motion.text
                  x={node.x}
                  y={node.y + 15}
                  textAnchor="middle"
                  fontSize="3"
                  fill={theme === "dark" ? "#e2e8f0" : "#334155"}
                  fontWeight={diagramHover === node.id ? "bold" : "normal"}
                  initial={useStandardScrolling ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={
                    useStandardScrolling ? { duration: 0 } : { duration: 0.5, delay: node.id.length * 0.1 + 0.3 }
                  }
                >
                  {node.label}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
        <div className="text-sm text-center text-muted-foreground mt-4">Hover over nodes to see relationships</div>
      </motion.div>
    )
  }

  // Section component with animations and sticky headers
  const Section = ({
    id,
    title,
    children,
    level = 2,
  }: {
    id: string
    title: string
    children: React.ReactNode
    level?: number
  }) => {
    const sectionRef = useRef<HTMLElement>(null)
    const headerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
    const isBookmarked = bookmarkedSections.includes(id)
    const isExpanded = expandedSections.includes(id)

    // Register section ref
    useEffect(() => {
      if (sectionRef.current) {
        sectionRefs.current[id] = sectionRef.current
      }
    }, [id])

    // Only apply sticky header behavior if standard scrolling is disabled
    useEffect(() => {
      if (useStandardScrolling || !headerRef.current) return

      const header = headerRef.current
      const originalStyles = {
        position: header.style.position,
        top: header.style.top,
        zIndex: header.style.zIndex,
        backgroundColor: header.style.backgroundColor,
        boxShadow: header.style.boxShadow,
        width: header.style.width,
      }

      const handleScroll = () => {
        if (!sectionRef.current || !headerRef.current) return

        const sectionRect = sectionRef.current.getBoundingClientRect()
        const headerHeight = headerRef.current.offsetHeight

        // Make header sticky when section top is above viewport but section bottom is still visible
        if (sectionRect.top < 60 && sectionRect.bottom > headerHeight + 60) {
          header.style.position = "fixed"
          header.style.top = "60px"
          header.style.zIndex = "10"
          header.style.backgroundColor = theme === "dark" ? "rgba(15, 23, 42, 0.8)" : "rgba(255, 255, 255, 0.8)"
          header.style.backdropFilter = "blur(8px)"
          header.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"
          header.style.width = `${sectionRef.current.offsetWidth}px`
        } else {
          // Reset styles when section is not in the sticky range
          header.style.position = originalStyles.position
          header.style.top = originalStyles.top
          header.style.zIndex = originalStyles.zIndex
          header.style.backgroundColor = originalStyles.backgroundColor
          header.style.backdropFilter = "none"
          header.style.boxShadow = originalStyles.boxShadow
          header.style.width = originalStyles.width
        }
      }

      window.addEventListener("scroll", handleScroll)
      handleScroll() // Initial check

      return () => {
        window.removeEventListener("scroll", handleScroll)
        // Reset styles on cleanup
        Object.assign(header.style, originalStyles)
      }
    }, [theme, useStandardScrolling])

    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

    return (
      <motion.section
        id={id}
        ref={sectionRef}
        className="mb-12 scroll-mt-20"
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={useStandardScrolling ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
      >
        <div
          ref={headerRef}
          className={cn(
            "flex items-center justify-between mb-4 py-2 rounded-md transition-all",
            level > 2 && "pl-4 border-l-2 border-border",
          )}
        >
          <HeadingTag
            className={cn(
              "font-bold tracking-tight",
              level === 2 && "text-2xl",
              level === 3 && "text-xl",
              level === 4 && "text-lg",
            )}
          >
            {title}
          </HeadingTag>
          <div className="flex items-center gap-2">
            {level === 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSectionExpansion(id)}
                className="h-8 w-8 transition-all hover:scale-110 active:scale-95"
                onMouseEnter={() => setCursorVariant("button")}
                onMouseLeave={() => setCursorVariant("default")}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(id)}
              className="transition-all hover:scale-110 active:scale-95"
              onMouseEnter={() => setCursorVariant("button")}
              onMouseLeave={() => setCursorVariant("default")}
            >
              {isBookmarked ? <BookmarkCheck className="h-5 w-5 text-primary" /> : <Bookmark className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {(isExpanded || level > 2) && (
            <motion.div
              initial={useStandardScrolling ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={useStandardScrolling ? { opacity: 0, height: "auto" } : { opacity: 0, height: 0 }}
              transition={useStandardScrolling ? { duration: 0 } : { duration: 0.3 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>
    )
  }

  // Note component with icon and styling
  const Note = ({
    type = "info",
    title,
    children,
  }: {
    type?: "info" | "warning" | "success" | "tip"
    title?: string
    children: React.ReactNode
  }) => {
    const icons = {
      info: <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-1" />,
      success: <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />,
      tip: <Lightbulb className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />,
    }

    const styles = {
      info: "border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-900/20",
      warning: "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20",
      success: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20",
      tip: "border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-900/20",
    }

    return (
      <motion.div
        className={`relative overflow-hidden p-4 my-6 rounded-lg border ${styles[type]}`}
        initial={useStandardScrolling ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={useStandardScrolling ? { duration: 0 } : { duration: 0.3 }}
      >
        <div className="flex gap-3">
          {icons[type]}
          <div>
            {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
            <div className="text-sm">{children}</div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Set isMounted on client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading content...</p>
      </div>
      </div>
    );
  }

  // Show error state
  if (hasError) {
  return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load documentation content</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If no documentation is selected, show a placeholder
  if (!selectedDocumentation) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-muted-foreground">Select a document to view its content</p>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="max-w-3xl mx-auto documentation-content">
      {/* Title and metadata */}
      <motion.div className="mb-8 pb-4" style={{ y: titleY }}>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            {selectedDocumentation?.title || 'Untitled Document'}
          </h1>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-0.5">
              {readingTime} min read
            </Badge>
            <Badge variant="secondary" className="px-2 py-0.5">
              {selectedDocumentation?.technology || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Main content with TipTap renderer */}
        <motion.div className="mt-4" style={{ opacity: subtitleOpacity }}>
          {selectedDocumentation?.content && (
            <ContentDisplay content={selectedDocumentation.content} />
          )}
        </motion.div>

        {/* Reading progress */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-2 flex-1 bg-accent/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${Math.round(readingProgress * 100)}%` }}
            ></motion.div>
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(readingProgress * 100)}%
          </span>
        </div>
      </motion.div>

      {/* Dynamic Sections */}
      {selectedDocumentation?.sections?.map((section) => (
        <Section 
          key={section.id} 
          id={section.sectionId || section.id?.toString() || ''}
          title={section.title} 
          level={2}
        >
          <ContentDisplay content={section.content} />
        </Section>
      ))}

      {/* Documentation footer */}
      <div className="mt-16 pt-8 border-t border-border">
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div>
            <p>Last updated: {selectedDocumentation?.lastUpdatedAt ? new Date(selectedDocumentation.lastUpdatedAt).toLocaleDateString() : 'Unknown'}</p>
            <p>Author: {selectedDocumentation?.authorUsername || 'Unknown'}</p>
            </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-2 py-0.5 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {selectedDocumentation?.views || 0} views
            </Badge>
            </div>
            </div>
            </div>
            </div>
  );
}

// Helper functions for content parsing and navigation
function extractCodeFromContent(content: string): string {
  const codeMatch = content.match(/```[\s\S]*?```/);
  return codeMatch ? codeMatch[0].replace(/```/g, '').trim() : '';
}

function extractFilenameFromContent(content: string): string | undefined {
  const filenameMatch = content.match(/filename:\s*([^\n]+)/);
  return filenameMatch ? filenameMatch[1].trim() : undefined;
}

function getPreviousSection(): DocumentationSectionDTO | undefined {
  // Implement logic to get previous section
  return undefined;
}

function getNextSection(): DocumentationSectionDTO | undefined {
  // Implement logic to get next section
  return undefined;
}

function navigateToPreviousSection() {
  // Implement navigation logic
}

function navigateToNextSection() {
  // Implement navigation logic
}

