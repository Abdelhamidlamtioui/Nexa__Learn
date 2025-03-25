"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, FileText, BookOpen, FileCode2, Coins, BarChart2, Settings, X } from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Users Management", href: "/admin/users" },
  { icon: FileText, label: "Content Management", href: "/admin/content" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: FileCode2, label: "Documentation", href: "/admin/documentation" },
  { icon: Coins, label: "Points Economy", href: "/admin/points" },
  { icon: BarChart2, label: "Reports", href: "/admin/reports" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

interface AdminSidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function AdminSidebar({ open, setOpen }: AdminSidebarProps) {
  const [activeItem, setActiveItem] = useState("Dashboard")

  return (
    <>
      <motion.div
        className={cn("fixed inset-0 bg-black/50 z-40", open ? "pointer-events-auto" : "pointer-events-none opacity-0")}
        onClick={() => setOpen(false)}
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.nav
        className="fixed top-0 left-0 bottom-0 w-64 bg-[#0A192F] z-50 shadow-lg"
        initial={{ x: "-100%" }}
        animate={{ x: open ? 0 : "-100%" }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)] py-4">
          {sidebarItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start px-4 py-2 text-left",
                  activeItem === item.label && "bg-purple-900 text-white",
                )}
                onClick={() => setActiveItem(item.label)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </ScrollArea>
      </motion.nav>
    </>
  )
}
