"use client"

import { UserManagement } from "@/components/admin/user-management/user-management"
import {AdminGuard} from "@/components/guards/AdminGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <UserManagement />
        </div>
      </div>
    </AdminGuard>
  )
}