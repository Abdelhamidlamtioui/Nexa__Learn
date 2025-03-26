"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, User } from "lucide-react"

interface ModeratorHeaderProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function ModeratorHeader({ activeSection, setActiveSection }: ModeratorHeaderProps) {
  const [notifications, setNotifications] = useState(3)

  return (
    <header className="bg-[#0F172A] bg-opacity-80 backdrop-filter backdrop-blur-lg border-b border-indigo-500/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Moderator Documentation Portal</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1">
                  {notifications}
                </Badge>
              )}
            </Button>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Moderator</span>
              <Badge variant="secondary">Level 3</Badge>
            </div>
          </div>
        </div>
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="badge-certification">Badge & Certification</TabsTrigger>
            <TabsTrigger value="content-moderation">Content Moderation</TabsTrigger>
            <TabsTrigger value="token-economy">Token Economy</TabsTrigger>
            <TabsTrigger value="structure-management">Structure Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  )
}

