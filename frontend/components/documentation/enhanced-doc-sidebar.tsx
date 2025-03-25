"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTheme } from "@/contexts/theme-context"
import { useDocContext } from "./enhanced-documentation-layout"
import { cn } from "@/lib/utils"
import { getTechnologyIcon, getTechnologyColor } from "./technology-icons"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { DocumentationDTO, DocumentationSectionDTO } from "@/app/types/documentation"
import React from "react"

// Define types for the static items to fix linter error
interface StaticItem {
  id: string;
  label: string;
  isNew: boolean;
  isUpdated: boolean;
}

interface StaticCategory {
  id: string;
  label: string;
  technologyType: string;
  description: string;
  items: StaticItem[];
}

// Fallback static data for when no real documentation exists
const fallbackSidebarData: StaticCategory[] = [
  {
    id: "core-concepts",
    label: "Core Concepts",
    technologyType: "FRAMEWORK",
    description: "Fundamental concepts and principles",
    items: [
      { id: "components", label: "Components", isNew: false, isUpdated: false },
      { id: "data-model", label: "Data Model", isNew: false, isUpdated: false },
      { id: "state-management", label: "State Management", isNew: false, isUpdated: true },
      { id: "routing", label: "Routing", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "api-reference",
    label: "API Reference",
    technologyType: "API",
    description: "Detailed API documentation",
    items: [
      { id: "rest-api", label: "REST API", isNew: false, isUpdated: false },
      { id: "graphql", label: "GraphQL", isNew: true, isUpdated: false },
      { id: "webhooks", label: "Webhooks", isNew: false, isUpdated: false },
      { id: "authentication", label: "Authentication", isNew: false, isUpdated: true },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    technologyType: "FRONTEND",
    description: "User interface components and design",
    items: [
      { id: "ui-components", label: "UI Components", isNew: false, isUpdated: false },
      { id: "styling", label: "Styling", isNew: false, isUpdated: false },
      { id: "animations", label: "Animations", isNew: true, isUpdated: false },
      { id: "forms", label: "Forms", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    technologyType: "BACKEND",
    description: "Server-side implementation details",
    items: [
      { id: "database", label: "Database", isNew: false, isUpdated: false },
      { id: "server", label: "Server", isNew: false, isUpdated: true },
      { id: "authentication", label: "Authentication", isNew: false, isUpdated: false },
      { id: "deployment", label: "Deployment", isNew: false, isUpdated: false },
    ],
  },
  {
    id: "advanced",
    label: "Advanced",
    technologyType: "ADVANCED",
    description: "Advanced techniques and optimizations",
    items: [
      { id: "optimization", label: "Optimization", isNew: false, isUpdated: false },
      { id: "security", label: "Security", isNew: false, isUpdated: true },
      { id: "testing", label: "Testing", isNew: false, isUpdated: false },
      { id: "monitoring", label: "Monitoring", isNew: true, isUpdated: false },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    technologyType: "RESOURCES",
    description: "Additional resources and references",
    items: [
      { id: "examples", label: "Examples", isNew: false, isUpdated: false },
      { id: "tutorials", label: "Tutorials", isNew: false, isUpdated: false },
      { id: "faqs", label: "FAQs", isNew: false, isUpdated: false },
      { id: "community", label: "Community", isNew: false, isUpdated: false },
    ],
  },
];

const isNewDocument = (createdAt?: string): boolean => {
  if (!createdAt) return false;
  
  const created = new Date(createdAt);
  const now = new Date(); // Dynamic current time
  
  const diffInHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffInHours < 24;
};

// Add helper function for recently updated documents
const isRecentlyUpdated = (createdAt?: string, lastUpdatedAt?: string): boolean => {
  if (!createdAt || !lastUpdatedAt) return false;
  
  const created = new Date(createdAt);
  const updated = new Date(lastUpdatedAt);
  const now = new Date(); // Dynamic current time
  
  const createdDiffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  const updatedDiffHours = (now.getTime() - updated.getTime()) / (1000 * 60 * 60);
  
  // Document is UPDATED if:
  // 1. It's more than 24 hours old (not new)
  // 2. It was updated in the last 24 hours
  // 3. The update timestamp is different from creation timestamp
  return createdDiffHours >= 24 && updatedDiffHours < 24 && created.getTime() !== updated.getTime();
};

// Add this helper function for sections
const isNewSection = (section: DocumentationSectionDTO): boolean => {
  return isNewDocument(section.createdAt);
};

// Add helper function for recently updated sections
const isRecentlyUpdatedSection = (section: DocumentationSectionDTO): boolean => {
  if (!section.createdAt || !section.lastUpdatedAt) return false;
  
  const created = new Date(section.createdAt);
  const updated = new Date(section.lastUpdatedAt);
  const now = new Date(); // Dynamic current time
  
  const createdDiffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  const updatedDiffHours = (now.getTime() - updated.getTime()) / (1000 * 60 * 60);
  
  // Section is UPDATED if:
  // 1. It's more than 24 hours old (not new)
  // 2. It was updated in the last 24 hours
  // 3. The update timestamp is different from creation timestamp
  return createdDiffHours >= 24 && updatedDiffHours < 24 && created.getTime() !== updated.getTime();
};

export function EnhancedDocSidebar() {
  const [isClient, setIsClient] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [expandedDocuments, setExpandedDocuments] = useState<string[]>([])
  const [filterText, setFilterText] = useState<string>("")
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [hasRealData, setHasRealData] = useState(false)
  
  // Get documentation data from store
  const { 
    documentations, 
    sections, 
    fetchDocumentations, 
    fetchDocumentSections, 
    setSelectedDocumentation, 
    setSelectedSection 
  } = useDocumentationStore()
  
  const { state } = useSidebar()
  const { theme } = useTheme()
  const { activeSection, setActiveSection, activePath, setActivePath, readSections, viewMode, setCursorVariant } =
    useDocContext()

  // Refs for keyboard navigation
  const sidebarRef = useRef<HTMLDivElement>(null)
  const focusedItemRef = useRef<HTMLAnchorElement>(null)

  // Add debounce for search filter
  const [debouncedFilterText, setDebouncedFilterText] = useState(filterText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterText(filterText);
    }, 150);

    return () => clearTimeout(timer);
  }, [filterText]);

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)

    // Try to restore expanded categories from local storage
    try {
      const savedCategories = localStorage.getItem("doc-expanded-categories")
      if (savedCategories) {
        setExpandedCategories(JSON.parse(savedCategories))
      }
      
      const savedDocuments = localStorage.getItem("doc-expanded-documents")
      if (savedDocuments) {
        setExpandedDocuments(JSON.parse(savedDocuments))
      }
    } catch (error) {
      console.error("Failed to restore expanded items:", error)
    }

    // Fetch documentations on first load
    fetchDocumentations().catch(error => {
      console.error("Failed to fetch documentations:", error)
    })
  }, [fetchDocumentations]) // Remove expandedCategories from dependencies

  // Ensure Getting Started is always expanded in a separate effect
  useEffect(() => {
    if (!expandedCategories.includes("GETTING_STARTED")) {
      setExpandedCategories(prev => [...prev, "GETTING_STARTED"])
    }
  }, [expandedCategories])

  // Check if we have real data whenever documentations change
  useEffect(() => {
    setHasRealData(documentations.length > 0)
  }, [documentations])

  // Save expanded categories to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-expanded-categories", JSON.stringify(expandedCategories))
      } catch (error) {
        console.error("Failed to save expanded categories:", error)
      }
    }
  }, [expandedCategories, isClient])

  // Save expanded documents to local storage
  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem("doc-expanded-documents", JSON.stringify(expandedDocuments))
      } catch (error) {
        console.error("Failed to save expanded documents:", error)
      }
    }
  }, [expandedDocuments, isClient])

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      return prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId];
    });
  }

  // Update the toggleDocument function to properly handle section loading
  const toggleDocument = async (docId: string) => {
    // Toggle the document expansion state immediately for better UX
    setExpandedDocuments((prev) => {
      const isCurrentlyExpanded = prev.includes(docId);
      return isCurrentlyExpanded ? prev.filter(id => id !== docId) : [...prev, docId];
    });

    // If we're expanding and don't have sections yet, fetch them
    if (!expandedDocuments.includes(docId)) {
      try {
        await fetchDocumentSections(docId);
      } catch (error) {
        console.error("Failed to load sections:", error);
      }
    }
  };

  // Handle document selection
  const handleDocumentClick = async (doc: DocumentationDTO) => {
    const docId = doc.id || '';
    
    // Toggle document expansion
    setExpandedDocuments((prev) => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );

    try {
      // Set selected documentation
      setSelectedDocumentation(doc);
      
      // Only fetch sections if not already present
      if (!doc.sections || doc.sections.length === 0) {
        await fetchDocumentSections(docId);
      }
    } catch (error) {
      console.error("Error loading document sections:", error);
    }
  };
  
  // Handle section selection
  const handleSectionClick = (
    doc: DocumentationDTO | { id: string; technology: string; title: string },
    section: DocumentationSectionDTO | { id: string; sectionId: string; title: string }
  ) => {
    setSelectedDocumentation(doc as DocumentationDTO)
    setSelectedSection(section as DocumentationSectionDTO)
    setActiveSection(section.sectionId || "")
    const docTech = doc.technology || "OTHER"
    const docId = doc.id || ""
    const sectionId = section.sectionId || ""
    setActivePath([docTech, docId, sectionId])
  }

  // Handle static item selection
  const handleStaticItemClick = (categoryId: string, itemId: string) => {
    setActiveSection(itemId)
    setActivePath([categoryId, itemId])
  }

  const handleCategoryClick = (e: React.MouseEvent, categoryId: string) => {
    e.preventDefault();
    
    // Special handling for "getting-started"
    if (categoryId === "getting-started") {
      // Find the chevron element and add a pulse animation
      const chevron = e.currentTarget.querySelector('[data-chevron="getting-started"]');
      if (chevron) {
        chevron.classList.add('pulse-animation');
        setTimeout(() => {
          chevron.classList.remove('pulse-animation');
        }, 300);
      }
      return; // Exit without toggling
    }
    
    // Normal toggle behavior for other categories
    toggleCategory(categoryId);
  };

  // Only compute display data once we have client-side rendering
  // This fixes potential infinite rendering loops
  const getDisplayData = () => {
    let result: Array<[string, any[]]> = [];

    if (!hasRealData) {
      const groupedStatic = fallbackSidebarData.reduce((acc: Record<string, any[]>, category) => {
        const techType = category.technologyType;
        if (!acc[techType]) {
          acc[techType] = [];
        }
        acc[techType].push(category);
        return acc;
      }, {});
      
      result = Object.entries(groupedStatic);
    } else {
      // Group documentations by technology type
      const groupedDocumentations = documentations.reduce((groups: Record<string, DocumentationDTO[]>, doc) => {
        const techType = doc.technology || "OTHER"
        if (!groups[techType]) {
          groups[techType] = []
        }
        groups[techType].push(doc)
        return groups
      }, {})
      
      result = Object.entries(groupedDocumentations)
        .map(([techType, docs]) => {
          const filteredDocs = docs.filter(doc => {
            const titleMatches = doc.title.toLowerCase().includes(debouncedFilterText.toLowerCase())
            const docSections = Array.isArray(sections) 
              ? sections.filter(section => section.documentationId === doc.id)
              : [];
            
            const sectionsMatch = docSections.some(section => 
              section.title?.toLowerCase().includes(debouncedFilterText.toLowerCase())
            );
            
            return titleMatches || sectionsMatch
          })
          
          return filteredDocs.length > 0 ? [techType, filteredDocs] : null
        })
        .filter((group): group is [string, DocumentationDTO[]] => group !== null)
    }

    // Filter displayData based on search text if it's not empty
    if (debouncedFilterText) {
      result = result
        .map(([techType, items]) => {
          // Standard filtering for all categories
          return [techType, items];
        })
        .filter((group): group is [string, any[]] => group !== null);
    }

    return result;
  }

  if (!isClient) {
    return null
  }

  // Compute display data only when rendering, not during state updates
  const displayData = getDisplayData();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  // If in focused mode, hide the sidebar
  if (viewMode === "focused") {
    return null
  }

  return (
    <Sidebar
      ref={sidebarRef}
      className={`border-r border-border overflow-hidden transition-all duration-300 ${
        theme === "dark" ? "bg-background/80" : "bg-background/90 sidebar-light-mode"
      } sticky top-0 z-30`}
      variant="sidebar"
      collapsible="offcanvas"
    >
      {theme !== "dark" && (
        <style>
          {`
            .sidebar-light-mode .text-muted-foreground {
              color: #000000 !important;
            }
            .sidebar-light-mode span,
            .sidebar-light-mode div,
            .sidebar-light-mode p {
              color: #000000;
            }
            
            .pulse-animation {
              animation: pulse 0.3s ease-in-out;
            }
            
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.5); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      )}

      <SidebarHeader className="border-b border-border pt-16">
        <div className="flex flex-col space-y-2 p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter docs..."
              className="w-full pl-9 h-9"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              onMouseEnter={() => setCursorVariant("text")}
              onMouseLeave={() => setCursorVariant("default")}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="py-2">
            {displayData.map(([techType, items]) => {
              // Special handling for Getting Started - always open
              const isGettingStarted = techType === "GETTING_STARTED";
              const isOpen = isGettingStarted || expandedCategories.includes(techType);
              
              // Get the icon based on technology type
              const CategoryIcon = getTechnologyIcon(techType);
              const categoryColor = getTechnologyColor(techType);
              
              return (
              <Collapsible
                  key={techType}
                  open={isOpen}
                  onOpenChange={() => toggleCategory(techType)}
                className="group transition-all duration-200"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between p-2 rounded-md transition-all",
                        "hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
                          hoveredCategory === techType && "bg-accent/30",
                          isGettingStarted && "bg-primary/5" // Highlight Getting Started section
                      )}
                      onMouseEnter={() => {
                          setHoveredCategory(techType)
                        setCursorVariant("button")
                      }}
                      onMouseLeave={() => {
                        setHoveredCategory(null)
                        setCursorVariant("default")
                      }}
                        aria-expanded={isOpen}
                        data-category={techType}
                        onClick={(e) => {
                          if (isGettingStarted) {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                    >
                      <motion.div className="flex items-center gap-2" variants={itemVariants}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-md",
                              categoryColor
                          )}
                        >
                            <CategoryIcon className="h-4 w-4" />
                        </motion.div>
                          <span className="text-sm font-medium">{techType.replace(/_/g, " ")}</span>
                          <Badge variant="outline" className="ml-2 text-xs">{Array.isArray(items) ? items.length : 0}</Badge>
                      </motion.div>
                      <motion.div
                          className={`chevron ${isGettingStarted ? 'getting-started-chevron' : ''}`}
                        animate={{
                            rotate: isOpen ? 180 : 0,
                            scale: hoveredCategory === techType ? 1.1 : 1,
                            opacity: isGettingStarted ? 0.5 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>

                    {/* Fix for the TypeScript error: use conditional rendering instead of forceMount */}
                    {isGettingStarted ? (
                      <div>
                        <SidebarGroupContent>
                          <div className="pl-8 pr-2 py-1 text-xs text-muted-foreground">
                            {techType.replace(/_/g, " ")} documentation
                          </div>
                          <SidebarMenu>
                            {/* Getting Started content */}
                            {(items as StaticCategory[]).map((category) => (
                              <SidebarMenuItem key={category.id}>
                        <motion.div
                                  whileHover={{ x: 4 }} 
                                  className="relative flex items-center justify-between w-full pl-8 py-1.5 text-sm rounded-md transition-all font-medium"
                                >
                                  {category.label}
                                </motion.div>
                                
                                <ul className="ml-10 mt-2 space-y-1">
                                  {category.items.map((item: StaticItem) => {
                                    const isActive = activeSection === item.id;
                                    const isRead = readSections.includes(item.id);

                                return (
                                      <li key={item.id}>
                                    <motion.div whileHover={{ x: 4 }} className="relative">
                                      {isActive && (
                                        <motion.div
                                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full"
                                          layoutId="activeIndicator"
                                          initial={{ height: 0 }}
                                          animate={{ height: "100%" }}
                                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                      )}

                                      <a
                                        href={`#${item.id}`}
                                        ref={isActive ? focusedItemRef : null}
                                        className={cn(
                                              "flex items-center gap-2 pl-2 py-1.5 text-sm rounded-md transition-all",
                                          "focus:outline-none focus:ring-2 focus:ring-primary/20",
                                          isActive
                                            ? "bg-primary/10 text-primary font-medium"
                                            : "text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                                          hoveredItem === item.id && "bg-accent/20",
                                          isRead && !isActive && "text-muted-foreground/70",
                                        )}
                                            onClick={() => handleStaticItemClick(category.id, item.id)}
                                        onMouseEnter={() => {
                                          setHoveredItem(item.id)
                                          setCursorVariant("link")
                                        }}
                                        onMouseLeave={() => {
                                          setHoveredItem(null)
                                          setCursorVariant("default")
                                        }}
                                      >
                                            <span>{item.label}</span>
                                            {item.isNew && (
                                              <Badge
                                                variant="outline"
                                                className="ml-2 text-[0.6rem] h-4 px-1 border-green-500 text-green-500 font-medium"
                                              >
                                                NEW
                                              </Badge>
                                            )}
                                            {item.isUpdated && !item.isNew && (
                                              <Badge
                                                variant="outline"
                                                className="ml-2 text-[0.6rem] h-4 px-1 border-blue-500 text-blue-500 font-medium"
                                              >
                                                UPDATED
                                              </Badge>
                                            )}
                                      </a>
                                    </motion.div>
                                      </li>
                                    );
                                  })}
                                </ul>
                                  </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </div>
                    ) : (
                      <CollapsibleContent>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <SidebarGroupContent>
                                <div className="pl-8 pr-2 py-1 text-xs text-muted-foreground">
                                  {techType.replace(/_/g, " ")} documentation
                                </div>
                                <SidebarMenu>
                                  {/* Render real documentation items */}
                                  {(items as DocumentationDTO[]).map((doc) => {
                                    const docId = doc.id || '';
                                    const isExpanded = expandedDocuments.includes(docId);
                                    const isNew = isNewDocument(doc.createdAt);

                                    return (
                                      <SidebarMenuItem key={docId}>
                                        <Collapsible
                                          open={isExpanded}
                                          onOpenChange={() => toggleDocument(docId)}
                                        >
                                          <CollapsibleTrigger asChild>
                                            <div 
                                              className={cn(
                                                "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                                                "hover:bg-accent/50 cursor-pointer",
                                                isExpanded && "bg-accent/30"
                                              )}
                                            >
                                              <div className="flex items-center gap-2">
                                                <motion.div
                                                  whileHover={{ scale: 1.1 }}
                                                  whileTap={{ scale: 0.95 }}
                                                  className={cn(
                                                    "flex items-center justify-center w-6 h-6 rounded-md",
                                                    getTechnologyColor(doc.technology)
                                                  )}
                                                >
                                                  {React.createElement(getTechnologyIcon(doc.technology))}
                                                </motion.div>
                                                <span className="font-medium">{doc.title}</span>
                                                {isNew && (
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 text-[0.6rem] h-4 px-1 border-green-500 text-green-500 font-medium"
                                                  >
                                                    NEW
                                                  </Badge>
                                                )}
                                              </div>
                                              <ChevronDown 
                                                className={cn(
                                                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                                                  isExpanded && "rotate-180"
                                                )}
                                              />
                                            </div>
                                          </CollapsibleTrigger>

                                          <CollapsibleContent>
                                            <AnimatePresence>
                                              {isExpanded && (
                                                <motion.div
                                                  initial={{ opacity: 0, height: 0 }}
                                                  animate={{ opacity: 1, height: "auto" }}
                                                  exit={{ opacity: 0, height: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="pl-4 mt-1 space-y-1"
                                                >
                                                  {doc.sections?.map((section) => {
                                                    const isSectionNew = isNewSection(section);
                                                    const isSectionUpdated = isRecentlyUpdatedSection(section);
                                                    
                                                    return (
                                                      <motion.div
                                                        key={section.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        className="relative"
                                                      >
                                                        <a
                                                          href={`#${section.sectionId}`}
                                                          className={cn(
                                                            "flex items-center justify-between px-2 py-1.5 text-sm rounded-md transition-colors",
                                                            activeSection === section.sectionId 
                                                              ? "bg-accent/50 text-accent-foreground font-medium"
                                                              : "text-muted-foreground hover:bg-accent/30 hover:text-accent-foreground"
                                                          )}
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            handleSectionClick(doc, section);
                                                          }}
                                                        >
                                                          <span className="truncate">{section.title}</span>
                                                          {isSectionNew && (
                                                            <Badge
                                                              variant="outline"
                                                              className="ml-2 text-[0.6rem] h-4 px-1 border-green-500 text-green-500 font-medium"
                                                            >
                                                              NEW
                                                            </Badge>
                                                          )}
                                                          {!isSectionNew && isSectionUpdated && (
                                                            <Badge
                                                              variant="outline"
                                                              className="ml-2 text-[0.6rem] h-4 px-1 border-blue-500 text-blue-500 font-medium"
                                                            >
                                                              UPDATED
                                                            </Badge>
                                                          )}
                                                        </a>
                                                      </motion.div>
                                                    );
                                                  })}
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </SidebarMenuItem>
                                    );
                              })}
                            </SidebarMenu>
                          </SidebarGroupContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CollapsibleContent>
                    )}
                </SidebarGroup>
              </Collapsible>
              )
            })}
          </motion.div>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex flex-col space-y-2">


          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 gap-2"
            onMouseEnter={() => setCursorVariant("button")}
            onMouseLeave={() => setCursorVariant("default")}
          >
            <Eye className="h-3 w-3" />
            <span>View on GitHub</span>
          </Button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

