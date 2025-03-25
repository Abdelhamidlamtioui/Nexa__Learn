"use client"

import { useState } from "react"
import { ForumHeader } from "@/components/forum-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopNav } from "@/components/admin/admin-top-nav"
import { StatisticsCards } from "@/components/admin/statistics-cards"
import { ChartRow } from "@/components/admin/chart-row"
import { RecentActivity } from "@/components/admin/recent-activity"
import { SystemHealth } from "@/components/admin/system-health"
import { QuickActions } from "@/components/admin/quick-actions"
import { SupportTickets } from "@/components/admin/support-tickets"
import { PlatformNotifications } from "@/components/admin/platform-notifications"
import { AdminGuard } from "@/components/guards/AdminGuard"
import { useAuthStore } from "@/stores/useAuthStore"

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useAuthStore()

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#663399] text-white">
        <ForumHeader />
        <div className="flex">
          <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
          <main className="flex-1 p-6">
            <AdminTopNav onMenuButtonClick={() => setSidebarOpen(true)} />
            <div className="mt-6">
              <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username}</h1>
              <StatisticsCards />
              <ChartRow />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="lg:col-span-2">
                  <RecentActivity />
                </div>
                <div>
                  <SystemHealth />
                  <QuickActions />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <SupportTickets />
                <PlatformNotifications />
              </div>
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
