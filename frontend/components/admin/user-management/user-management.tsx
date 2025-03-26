"use client"

import { useState } from "react"
import { UserStatisticsBanner } from "./user-statistics-banner"
import { UserTable } from "./user-table"
import { UserFilters } from "./user-filters"
import { UserBulkActions } from "./user-bulk-actions"
import { UserInsightsDrawer } from "./user-insights-drawer"
import { AddUserModal } from "./add-user-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ForumHeader } from "@/components/forum-header"
import { Toaster } from "@/components/ui/toaster"
import { userService } from "@/services/api"

export function UserManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers(currentPage)
      return response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleUserAdded = async () => {
    await fetchUsers()
    setSearchQuery("")
    setCurrentPage(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] to-[#663399] text-white">
      <ForumHeader />
      <Toaster />
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="container mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
              <Button 
                className="w-full md:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search users by name, email, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 bg-gray-800 border-gray-700 w-full"
                  />
                </div>
                </div>
              <div className="w-full lg:w-auto">
                <UserBulkActions selectedUsers={selectedUsers} />
              </div>
            </div>

            <div className="space-y-6">
              <UserStatisticsBanner />

              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-64 order-2 lg:order-1">
                  <div className="sticky top-6">
                    <UserFilters />
                  </div>
                </div>
                <div className="flex-1 order-1 lg:order-2 overflow-x-auto">
                  <UserTable
                    searchQuery={searchQuery}
                    selectedUsers={selectedUsers}
                    onSelectUsers={setSelectedUsers}
                    onSelectUser={setSelectedUser}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <UserInsightsDrawer 
        userId={selectedUser} 
        open={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
      
      <AddUserModal
        open={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSuccess={handleUserAdded}
      />
    </div>
  )
}
