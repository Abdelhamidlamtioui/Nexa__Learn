import { useState, useEffect } from "react"
import { Search, ChevronDown, Globe, Sun, Moon, Edit, Save } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDocumentationStore } from "@/stores/useDocumentationStore"
import { toast } from "@/components/ui/use-toast"

interface DocumentationHeaderProps {
  darkMode: boolean
  setDarkMode: (darkMode: boolean) => void
}

export function DocumentationHeader({ darkMode, setDarkMode }: DocumentationHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const { selectedDocumentation, selectedSection, updateSection } = useDocumentationStore()
  
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Update the title when the selected section changes
  useEffect(() => {
    if (selectedSection) {
      setEditedTitle(selectedSection.title)
    }
  }, [selectedSection])
  
  const handleTitleEdit = () => {
    setIsEditingTitle(true)
  }
  
  const handleTitleSave = async () => {
    if (selectedSection && selectedSection.id && editedTitle.trim()) {
      try {
        await updateSection(selectedSection.id, { title: editedTitle })
        setIsEditingTitle(false)
        toast({
          title: "Title updated",
          description: "Document title has been successfully updated.",
        })
      } catch (error) {
        console.error("Failed to update section title:", error)
        toast({
          title: "Update failed",
          description: "Failed to update document title. Please try again.",
          variant: "destructive"
        })
      }
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleSave()
    } else if (e.key === "Escape") {
      setIsEditingTitle(false)
      setEditedTitle(selectedSection?.title || "")
    }
  }

  return (
    <header className={`sticky top-0 z-10 transition-all duration-300 ${isScrolled ? "glass-morphism shadow-md" : ""}`}>
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center space-x-4 flex-grow">
          {/* Document title display/edit */}
          {selectedSection && (
            <div className="flex items-center mr-4">
              {isEditingTitle ? (
                <div className="flex items-center">
                  <Input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className="w-64 bg-white bg-opacity-10 focus:bg-opacity-20 transition-all duration-300"
                  />
                  <Button variant="ghost" size="sm" onClick={handleTitleSave} className="ml-2">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center">
                  <h2 className="text-xl font-medium">{selectedSection.title}</h2>
                  <Button variant="ghost" size="sm" onClick={handleTitleEdit} className="ml-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="relative flex-grow max-w-2xl">
            <Input
              type="text"
              placeholder="Search documentation..."
              className="w-full pl-10 pr-4 py-2 rounded-md bg-white bg-opacity-10 focus:bg-opacity-20 transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          {/* Rest of the header content */}
          <Select>
            <SelectTrigger className="w-[180px] bg-white bg-opacity-10 glow-effect">
              <SelectValue placeholder="All Technologies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Technologies</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="nodejs">Node.js</SelectItem>
              <SelectItem value="python">Python</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[100px] bg-white bg-opacity-10 glow-effect">
              <SelectValue placeholder="v1.0" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v1.0">v1.0</SelectItem>
              <SelectItem value="v0.9">v0.9</SelectItem>
              <SelectItem value="v0.8">v0.8</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="glow-effect">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!darkMode)} className="glow-effect">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}

