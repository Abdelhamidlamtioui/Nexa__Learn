import { Button } from "@/components/ui/button"

interface ModeratorSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function ModeratorSidebar({ activeSection, setActiveSection }: ModeratorSidebarProps) {
  const sections = [
    { id: "content-moderation", label: "Content Moderation Guidelines" },
    { id: "token-economy", label: "Token Economy Management" },
    { id: "user-management", label: "User Management Tools" },
    { id: "badge-certification", label: "Badge & Certification Review" },
    { id: "documentation-contribution", label: "Documentation Contribution Review" },
  ]

  return (
    <nav className="w-64 bg-gray-800 p-4">
      {sections.map((section) => (
        <Button
          key={section.id}
          variant={activeSection === section.id ? "default" : "ghost"}
          className="w-full justify-start mb-2"
          onClick={() => setActiveSection(section.id)}
        >
          {section.label}
        </Button>
      ))}
    </nav>
  )
}

