import { useState } from "react"
import { ChevronDown, ChevronRight, Bookmark, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentationSidebar() {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(256)

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    setSidebarWidth(e.clientX)
  }

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <aside
      className="bg-white dark:bg-gray-800 overflow-y-auto relative glass-morphism"
      style={{ width: sidebarWidth }}
    >
      <div className="p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 glow-effect"
                onClick={() => toggleCategory("gettingStarted")}
              >
                {expandedCategories.includes("gettingStarted") ? (
                  <ChevronDown className="mr-2" />
                ) : (
                  <ChevronRight className="mr-2" />
                )}
                Getting Started
              </Button>
              {expandedCategories.includes("gettingStarted") && (
                <ul className="ml-4 mt-2 space-y-2 transition-all duration-300">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-primary-end block py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Installation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-primary-end block py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Quick Start Guide
                    </a>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700 glow-effect"
                onClick={() => toggleCategory("core")}
              >
                {expandedCategories.includes("core") ? (
                  <ChevronDown className="mr-2" />
                ) : (
                  <ChevronRight className="mr-2" />
                )}
                Core Concepts
              </Button>
              {expandedCategories.includes("core") && (
                <ul className="ml-4 mt-2 space-y-2 transition-all duration-300">
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-primary-end block py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      Components
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-sm hover:text-primary-end block py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
                    >
                      State Management
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Quick Access</h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="flex items-center text-sm hover:text-primary-end py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Bookmark className="mr-2 h-4 w-4" /> Bookmarks
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-sm hover:text-primary-end py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Clock className="mr-2 h-4 w-4" /> Recently Viewed
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center text-sm hover:text-primary-end py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
              >
                <Star className="mr-2 h-4 w-4" /> Popular Articles
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300"
        onMouseDown={handleMouseDown}
      />
    </aside>
  )
}

