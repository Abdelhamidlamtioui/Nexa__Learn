"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  ChevronRight,
  FileText,
  FolderPlus,
  FilePlus,
  Search,
  Settings,
  Home,
  BookOpen,
  Users,
  Shield,
  BarChart,
  HelpCircle,
  PanelLeft,
  Sparkles,
  Code,
  Server,
  Database,
  Library,
  BookTemplate,
  X,
  FolderOpen, PlusCircle
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog"
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs"
import { documentationService } from '@/services/api'
import { DocumentationDTO, DocumentationSectionDTO } from '@/app/types/documentation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useDocumentationStore } from '@/stores/useDocumentationStore'

export function EnhancedDocumentationSidebar() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const [isCreatingDocument, setIsCreatingDocument] = useState(false)
  const [newDocumentName, setNewDocumentName] = useState("")
  const [newDocumentParentId, setNewDocumentParentId] = useState<string | null>(null)
  
  // Template creation modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [templateType, setTemplateType] = useState("react")
  const [templateTitle, setTemplateTitle] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)

  // Add documentation store
  const { 
    documentations, 
    selectedDocumentation, 
    selectedSection,
    fetchDocumentations, 
    setSelectedDocumentation, 
    setSelectedSection,
    fetchDocumentSections,
    loading,
    error
  } = useDocumentationStore();
  

  const selectedDoc = selectedDocumentation?.id || null;
  
  // Add this new state for document loading
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  
  // Update your useEffect to use the store's fetchDocumentations
  useEffect(() => {
    fetchDocumentations();
  }, [fetchDocumentations]);
  
  // Fix the handleDocSelect function to properly handle loading state
  const handleDocSelect = async (doc: DocumentationDTO) => {
    try {
      // Set loading state
      setIsLoadingDoc(true);
      
      // Fetch sections for this documentation
      // Use fetchDocumentSections from your store, not fetchDocumentation which doesn't exist
      await fetchDocumentSections(doc.id as string);
      
      // Update the selected documentation in the store
      setSelectedDocumentation(doc);
      
      setIsLoadingDoc(false);
    } catch (error) {
      console.error("Error selecting documentation:", error);
      setIsLoadingDoc(false);
    }
  };
  
  // Update handleSectionSelect to use the store
  const handleSectionSelect = (section: DocumentationSectionDTO) => {
    setSelectedSection(section);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

    const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left
      if (newWidth > 200 && newWidth < 500) {
        setSidebarWidth(newWidth)
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleCreateFromTemplate = async () => {
    if (!templateTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for the documentation",
        variant: "destructive"
      })
      return
    }

    try {
      setIsSubmitting(true)
      const response = await documentationService.createFromTemplate(
        templateType,
        {
          title: templateTitle,
          description: templateDescription
        }
      )

      if (response.data && response.data.success) {
        toast({
          title: "Success",
          description: "Documentation created successfully from template",
        })
        
        // Refresh the list of documentations
        await fetchDocumentations()
        
        // Close the modal and reset form
        setIsTemplateModalOpen(false)
        resetTemplateForm()
      } else {
        toast({
          title: "Error",
          description: "Failed to create documentation from template",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error("Error creating documentation from template:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating documentation",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetTemplateForm = () => {
    setTemplateType("react")
    setTemplateTitle("")
    setTemplateDescription("")
  }

  const handleCreateDocument = async (docId: string) => {
    if (!newDocumentName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for the section",
        variant: "destructive"
      })
      return
    }

    try {
      const response = await documentationService.createSection(docId, {
        title: newDocumentName,
        content: "<p>Add your content here</p>",
        sectionId: newDocumentName.toLowerCase().replace(/\s+/g, "-")
      })

      if (response.data && response.data.success) {
        toast({
          title: "Success",
          description: "Section created successfully",
        })
        
        // Refresh the list of documentations to show the new section
        await fetchDocumentations()
        
        // Reset form
        setNewDocumentName("")
        setIsCreatingDocument(false)
      } else {
        toast({
          title: "Error",
          description: "Failed to create section",
          variant: "destructive"
        })
      }
    } catch (err) {
      console.error("Error creating section:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating section",
        variant: "destructive"
      })
    }
  }

  // Filter documentations based on search query
  const filteredDocumentations = documentations.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div
      ref={sidebarRef}
      className={`border-r border-indigo-500/20 bg-indigo-900/30 backdrop-blur-md transition-all duration-300 relative h-full`}
      style={{ width: isExpanded ? `${sidebarWidth}px` : "64px" }}
    >
      <div className="p-3 border-b border-indigo-500/20 flex items-center justify-between">
        {isExpanded ? (
          <>
            <h2 className="font-semibold text-indigo-100">Documentation</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-7 w-7 p-0 text-indigo-300 hover:text-white hover:bg-indigo-700/30"
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="h-7 w-7 p-0 mx-auto text-indigo-300 hover:text-white hover:bg-indigo-700/30"
          >
            <PanelLeft className="h-4 w-4 transform rotate-180" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="p-3 border-b border-indigo-500/20">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 bg-indigo-800/30 border-indigo-500/30 text-white placeholder:text-indigo-400 focus-visible:ring-indigo-500/50"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col h-[calc(100vh-180px)]">
        <ScrollArea className="flex-1">
          {isExpanded ? (
            <div className="p-3">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-red-400 p-2">{error}</div>
              ) : (
                <>
                  <DynamicDocumentTree 
                    documentations={filteredDocumentations}
                    selectedDoc={selectedDoc}
                    selectedSection={selectedSection}
                    onDocumentSelect={handleDocSelect}
                    onSectionSelect={handleSectionSelect}
                    isCreatingDocument={isCreatingDocument}
                    setIsCreatingDocument={setIsCreatingDocument}
                    newDocumentName={newDocumentName}
                    setNewDocumentName={setNewDocumentName}
                    handleCreateDocument={handleCreateDocument}
                    newDocumentParentId={newDocumentParentId}
                    setNewDocumentParentId={setNewDocumentParentId}
                  />
                  
                  {/* Create New Documentation button */}
                  <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-indigo-300 hover:text-white hover:bg-indigo-700/30 pl-3 mt-4"
                      >
                        <FolderPlus className="h-4 w-4 mr-2" />
                        New Documentation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-indigo-900/90 border-indigo-500/30 text-white">
                      <DialogHeader>
                        <DialogTitle className="text-white flex items-center">
                          <BookTemplate className="h-5 w-5 mr-2 text-indigo-400" />
                          Create Documentation from Template
                        </DialogTitle>
                        <DialogDescription className="text-indigo-300">
                          Select a template type and provide basic information to get started.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="template-type" className="text-right text-indigo-200">
                            Template
                          </Label>
                          <Select 
                            value={templateType} 
                            onValueChange={setTemplateType}
                          >
                            <SelectTrigger id="template-type" className="col-span-3 bg-indigo-800/50 border-indigo-500/30 text-white focus:ring-indigo-500/50">
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent className="bg-indigo-900 border-indigo-500/30 text-white">
                              <SelectItem value="react" className="hover:bg-indigo-800 focus:bg-indigo-800">
                                <div className="flex items-center">
                                  <Code className="h-4 w-4 mr-2 text-blue-400" />
                                  React Frontend
                                </div>
                              </SelectItem>
                              <SelectItem value="spring" className="hover:bg-indigo-800 focus:bg-indigo-800">
                                <div className="flex items-center">
                                  <Server className="h-4 w-4 mr-2 text-green-400" />
                                  Spring Backend
                                </div>
                              </SelectItem>
                              <SelectItem value="api" className="hover:bg-indigo-800 focus:bg-indigo-800">
                                <div className="flex items-center">
                                  <Database className="h-4 w-4 mr-2 text-yellow-400" />
                                  API Documentation
                                </div>
                              </SelectItem>
                              <SelectItem value="general" className="hover:bg-indigo-800 focus:bg-indigo-800">
                                <div className="flex items-center">
                                  <Library className="h-4 w-4 mr-2 text-purple-400" />
                                  General Library
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right text-indigo-200">
                            Title
                          </Label>
                          <Input
                            id="title"
                            value={templateTitle}
                            onChange={(e) => setTemplateTitle(e.target.value)}
                            className="col-span-3 bg-indigo-800/50 border-indigo-500/30 text-white focus:ring-indigo-500/50"
                            placeholder="Documentation title"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right text-indigo-200">
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={templateDescription}
                            onChange={(e) => setTemplateDescription(e.target.value)}
                            className="col-span-3 bg-indigo-800/50 border-indigo-500/30 text-white focus:ring-indigo-500/50"
                            placeholder="Brief description"
                            rows={3}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setIsTemplateModalOpen(false)
                            resetTemplateForm()
                          }}
                          className="bg-transparent border-indigo-500/50 text-indigo-300 hover:bg-indigo-800/50 hover:text-white"
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateFromTemplate}
                          disabled={isSubmitting || !templateTitle.trim()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white rounded-full border-t-transparent"></div>
                              Creating...
                            </>
                          ) : (
                            "Create Documentation"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center pt-4 gap-4">
              <EnhancedIconButton icon={<FileText />} tooltip="Documents" />
              <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
                <DialogTrigger asChild>
                  <Button className="h-8 w-8 p-0 rounded-full bg-indigo-800/30 hover:bg-indigo-700/40 text-indigo-300 hover:text-white transition-all duration-300">
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </Dialog>
              <EnhancedIconButton icon={<FilePlus />} tooltip="New Document" />
            </div>
          )}
        </ScrollArea>

        {isExpanded ? (
          <div className="p-7 border-t border-indigo-500/20">
            <div className="flex flex-col gap-1">
              <EnhancedNavButton icon={<BookOpen />} label="Documentation" isActive />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 border-t border-indigo-500/20">
            <EnhancedIconButton icon={<Home />} tooltip="Dashboard" />
            <EnhancedIconButton icon={<BookOpen />} tooltip="Documentation" isActive />
            <EnhancedIconButton icon={<Settings />} tooltip="Settings" />
          </div>
        )}
      </div>

      {isDragging && (
        <div className="fixed inset-0 z-50 cursor-col-resize" />
      )}
      
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-indigo-500/30 transition-colors duration-200"
        onMouseDown={handleMouseDown}
      />
    </div>
  )
}

interface DynamicDocumentTreeProps {
  documentations: DocumentationDTO[];
  selectedDoc: string | null;
  selectedSection: DocumentationSectionDTO | null;
  onDocumentSelect: (doc: DocumentationDTO) => void;
  onSectionSelect: (section: DocumentationSectionDTO) => void;
  isCreatingDocument: boolean;
  setIsCreatingDocument: (isCreating: boolean) => void;
  newDocumentName: string;
  setNewDocumentName: (name: string) => void;
  handleCreateDocument: (docId: string) => void;
  newDocumentParentId: string | null;
  setNewDocumentParentId: (id: string | null) => void;
}

function DynamicDocumentTree({
  documentations,
  selectedDoc,
  selectedSection,
  onDocumentSelect,
  onSectionSelect,
  isCreatingDocument,
  setIsCreatingDocument,
  newDocumentName,
  setNewDocumentName,
  handleCreateDocument,
  newDocumentParentId,
  setNewDocumentParentId
}: DynamicDocumentTreeProps) {
  return (
    <div className="space-y-1">
      {documentations.map((doc) => (
        <div key={doc.id}>
          <DynamicDocumentFolder
            documentation={doc}
            isSelected={selectedDoc === doc.id}
            onSelect={() => onDocumentSelect(doc)}
            onCreateDocument={() => {
              setNewDocumentParentId(doc.id as string);
              setIsCreatingDocument(true);
            }}
            selectedSection={selectedSection}
            onSectionSelect={onSectionSelect}
            isCreatingDocument={isCreatingDocument && newDocumentParentId === doc.id}
            newDocumentName={newDocumentName}
            setNewDocumentName={setNewDocumentName}
            handleCreateDocument={() => handleCreateDocument(doc.id as string)}
            cancelCreateDocument={() => {
              setIsCreatingDocument(false);
              setNewDocumentParentId(null);
            }}
          />
        </div>
      ))}
      
      {/* Remove the form from here as it will now be inside each folder */}
    </div>
  )
}

interface DynamicDocumentFolderProps {
  documentation: DocumentationDTO;
  isSelected: boolean;
  onSelect: () => void;
  onCreateDocument: () => void;
  selectedSection: DocumentationSectionDTO | null;
  onSectionSelect: (section: DocumentationSectionDTO) => void;
  isCreatingDocument: boolean;
  newDocumentName: string;
  setNewDocumentName: (name: string) => void;
  handleCreateDocument: () => void;
  cancelCreateDocument: () => void;
}

function DynamicDocumentFolder({ 
  documentation, 
  isSelected, 
  onSelect, 
  onCreateDocument,
  selectedSection,
  onSectionSelect,
  isCreatingDocument,
  newDocumentName,
  setNewDocumentName,
  handleCreateDocument,
  cancelCreateDocument
}: DynamicDocumentFolderProps) {
  const [isOpen, setIsOpen] = useState(isSelected || isCreatingDocument);
  
  // Force open when selected or creating a document
  useEffect(() => {
    if (isSelected || isCreatingDocument) {
      setIsOpen(true);
    }
  }, [isSelected, isCreatingDocument]);

  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const getStatusColor = () => {
    switch (documentation.status) {
      case "PUBLISHED": return "bg-green-500";
      case "REVIEW": return "bg-blue-500";
      case "ARCHIVED": return "bg-gray-500";
      default: return "bg-yellow-500"; // DRAFT
    }
  };

  return (
    <div className="mb-1">
      <button
        onClick={() => {
          onSelect();
          // Auto-expand when clicking on the document title
          setIsOpen(true);
        }}
        className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between group transition-colors duration-200 ${
          isSelected ? "bg-indigo-800/50" : "hover:bg-indigo-800/30"
        }`}
      >
        <div className="flex items-center">
          <button onClick={toggleOpen} className="mr-1 focus:outline-none">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-indigo-300" />
            ) : (
              <ChevronRight className="h-4 w-4 text-indigo-300" />
            )}
          </button>
          {isOpen ? (
            <FolderOpen className="h-4 w-4 mr-2 text-indigo-300" />
          ) : (
            <FileText className="h-4 w-4 mr-2" />
          )}
          <span className="truncate max-w-[150px]">{documentation.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} title={documentation.status} />
        </div>
      </button>

      {isOpen && (
        <div className="ml-4 mt-1 space-y-1 pl-2 border-l border-indigo-500/30">
          {documentation.sections && documentation.sections.length > 0 ? (
            documentation.sections.map((section) => (
              <button
                key={section.id}
                className={`w-full text-left px-3 py-1.5 rounded-md flex items-center text-sm transition-colors duration-200 ${
                  selectedSection?.id === section.id
                    ? "bg-indigo-700/60 text-white"
                    : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
                }`}
                onClick={() => onSectionSelect(section)}
              >
                <FileText className="h-4 w-4 mr-2" />
                <span className="truncate max-w-[160px]">{section.title}</span>
              </button>
            ))
          ) : (
            <div className="text-indigo-400/60 text-xs px-2 py-1">No documents</div>
          )}
          
          {/* Show the New Document button or the creation form */}
          {isCreatingDocument ? (
            <div className="p-2 bg-indigo-800/40 rounded border border-indigo-500/30 animate-fadeIn mt-2">
              <div className="flex items-center gap-2 mb-2">
                <PlusCircle className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium text-white">New Section</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  placeholder="Section name"
                  autoFocus
                  className="h-8 text-sm bg-indigo-900/50 border-indigo-500/30 text-white"
                />
                <Button
                  size="sm"
                  className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleCreateDocument}
                >
                  Add
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 p-0 w-8 bg-transparent border-indigo-500/30 text-indigo-300"
                  onClick={cancelCreateDocument}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateDocument();
              }}
              className="w-full flex items-center px-3 py-1.5 text-sm text-indigo-300 hover:text-white hover:bg-indigo-600/40 rounded-md transition-colors duration-200 border border-indigo-500/30 bg-indigo-800/20"
            >
              <FilePlus className="h-4 w-4 mr-2" />
              <span>New Document</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

interface EnhancedNavButtonProps {
  icon: React.ReactElement;
  label: string;
  isActive?: boolean;
}

function EnhancedNavButton({ icon, label, isActive = false }: EnhancedNavButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`w-full justify-start transition-all duration-300 ${
        isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
      }`}
    >
      {React.cloneElement(icon, { className: "h-4 w-4 mr-2" })}
      {label}
    </Button>
  )
}

interface EnhancedIconButtonProps {
  icon: React.ReactElement;
  tooltip: string;
  isActive?: boolean;
  onClick?: () => void;
}

function EnhancedIconButton({ icon, tooltip, isActive = false, onClick }: EnhancedIconButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`h-8 w-8 p-0 transition-all duration-300 ${
          isActive ? "bg-indigo-700/40 text-white" : "text-indigo-300 hover:text-white hover:bg-indigo-700/30"
        } ${isHovered ? "scale-110" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {React.cloneElement(icon, {
          className: `h-4 w-4 transition-all duration-300 ${isActive ? "text-indigo-400" : ""}`,
        })}
      </Button>
      <div className="absolute left-full ml-2 px-2 py-1 bg-indigo-900 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 glass-panel">
        {tooltip}
      </div>
    </div>
  )
}

function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

