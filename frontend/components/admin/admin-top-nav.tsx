"use client"

import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminTopNavProps {
  onMenuButtonClick: () => void
}

export function AdminTopNav({ onMenuButtonClick }: AdminTopNavProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuButtonClick}>
          <Menu className="h-6 w-6" />
        </Button>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/01.png" alt="Admin" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
