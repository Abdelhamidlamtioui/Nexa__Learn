"use client"

import { UserManagement } from "@/components/admin/user-management/user-management"
import {AdminGuard} from "@/components/guards/AdminGuard";

export default function UserManagementPage() {
  return <AdminGuard>
  <UserManagement />
  </AdminGuard>
} 