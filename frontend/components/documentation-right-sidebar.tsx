import { useState, useEffect } from "react"
import { Clock, ThumbsUp, MessageSquare } from "lucide-react"

export function DocumentationRightSidebar() {
  const [activeSection, setActiveSection] = useState("")
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("h2")
      let currentSection = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        if (window.pageYOffset >= sectionTop - 60) {
          currentSection = section.id
        }
      })
      setActiveSection(currentSection)

      const scrollPosition = window.pageYOffset
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      setReadingProgress((scrollPosition / totalHeight) * 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 p-4 overflow-y-auto glass-morphism">
      <div className="mb-4">
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-primary-start to-primary-end rounded-full transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          ></div>
        </div>
      </div>
      <h3 className="font-semibold mb-4 text-primary-end">Table of Contents</h3>
      <nav>
        <ul className="space-y-2">
          <li>
            <a
              href="#installation"
              className={`text-sm hover:text-primary-end block py-1 px-2 rounded transition-colors duration-300 ${
                activeSection === "installation" ? "bg-highlight dark:bg-highlight text-primary-end" : ""
              }`}
            >
              Installation
            </a>
          </li>
          <li>
            <a
              href="#your-first-component"
              className={`text-sm hover:text-primary-end block py-1 px-2 rounded transition-colors duration-300 ${
                activeSection === "your-first-component" ? "bg-highlight dark:bg-highlight text-primary-end" : ""
              }`}
            >
              Your First Component
            </a>
          </li>
          <li>
            <a
              href="#props-and-state"
              className={`text-sm hover:text-primary-end block py-1 px-2 rounded transition-colors duration-300 ${
                activeSection === "props-and-state" ? "bg-highlight dark:bg-highlight text-primary-end" : ""
              }`}
            >
              Props and State
            </a>
          </li>
        </ul>
      </nav>
      <div className="mt-8">
        <h3 className="font-semibold mb-2 text-secondary-end">Article Info</h3>
        <p className="text-sm flex items-center mb-1">
          <Clock className="mr-2 h-4 w-4 text-secondary-start" /> Last updated: 2 days ago
        </p>
        <p className="text-sm flex items-center mb-1">
          <ThumbsUp className="mr-2 h-4 w-4 text-secondary-start" /> 95% found this helpful
        </p>
        <p className="text-sm flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-secondary-start" /> 24 comments
        </p>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2 text-secondary-end">Related Documents</h3>
        <ul className="space-y-2">
          <li>
            <a href="#" className="text-sm hover:text-primary-end">
              Advanced React Patterns
            </a>
          </li>
          <li>
            <a href="#" className="text-sm hover:text-primary-end">
              React Hooks in Depth
            </a>
          </li>
          <li>
            <a href="#" className="text-sm hover:text-primary-end">
              State Management with Redux
            </a>
          </li>
        </ul>
      </div>
    </aside>
  )
}

