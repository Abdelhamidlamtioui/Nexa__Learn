"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Eye, Ban, Trash2, Shield, GraduationCap, School } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useUserStore } from "@/stores/useUserStore"

interface Role {
  name: string;
  id: string;
}

interface User {
  id: string
  username: string
  email: string
  avatar: string
  roles: Role[]
  registrationDate: string
  points: number
  status: "active" | "suspended"
  lastLogin: string
  createdAt: string
  enabled: boolean
}

interface UserTableProps {
  searchQuery: string
  selectedUsers: string[]
  onSelectUsers: (users: string[]) => void
  onSelectUser: (userId: string) => void
}

export function UserTable({ searchQuery, selectedUsers, onSelectUsers, onSelectUser }: UserTableProps) {
  const { toast } = useToast()
  const { 
    users, 
    loading, 
    currentPage, 
    totalPages,
    totalElements,
    sortBy,
    sortDirection,
    fetchUsers, 
    deleteUser, 
    updateUserStatus,
    setCurrentPage,
    setSorting
  } = useUserStore()
  
  useEffect(() => {
    fetchUsers()
  }, [currentPage, fetchUsers])

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (userId: string, isEnabled: boolean) => {
    try {
      await updateUserStatus(userId, isEnabled)
      toast({
        title: "Success",
        description: `User has been ${isEnabled ? 'enabled' : 'disabled'} successfully.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users?.filter((user) =>
    Object.values(user).some((value) => 
      value !== null && 
      value !== undefined && 
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  ) || [];

  const handleSort = (column: keyof User) => {
    if (sortBy === column) {
      setSorting(column, sortDirection === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSorting(column, 'ASC')
    }
  }

  const getSortIcon = (column: keyof User) => {
    if (sortBy !== column) return null
    return sortDirection === 'ASC' ? '↑' : '↓'
  }

  const handleSelectAll = () => {
    if (!users) return;
    if (selectedUsers.length === users.length) {
      onSelectUsers([])
    } else {
      onSelectUsers(users.map((user) => user.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      onSelectUsers(selectedUsers.filter((id) => id !== userId))
    } else {
      onSelectUsers([...selectedUsers, userId])
    }
  }

  const getRoleBadgeStyle = (role: string): { color: string, bgColor: string, icon: any } => {
    if (!role) return {
      color: 'text-gray-100',
      bgColor: 'bg-gray-500/80 hover:bg-gray-500',
      icon: Shield
    };

    switch (role.toUpperCase()) {
      case 'ADMIN':
        return {
          color: 'text-red-100',
          bgColor: 'bg-red-500/80 hover:bg-red-500',
          icon: Shield
        }
      case 'INSTRUCTOR':
        return {
          color: 'text-blue-100',
          bgColor: 'bg-blue-500/80 hover:bg-blue-500',
          icon: School
        }
      case 'STUDENT':
        return {
          color: 'text-emerald-100',
          bgColor: 'bg-emerald-500/80 hover:bg-emerald-500',
          icon: GraduationCap
        }
      case 'MODERATOR':
        return {
          color: 'text-purple-100',
          bgColor: 'bg-purple-500/80 hover:bg-purple-500',
          icon: Shield
        }
      default:
        return {
          color: 'text-gray-100',
          bgColor: 'bg-gray-500/80 hover:bg-gray-500',
          icon: Shield
        }
    }
  }

  const formatRoleName = (role: Role | string) => {
    const roleName = typeof role === 'string' ? role : role.name;
    return roleName.charAt(0) + roleName.slice(1).toLowerCase();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="rounded-md border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={users?.length > 0 && selectedUsers?.length === users?.length} 
                  onCheckedChange={handleSelectAll} 
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer min-w-[200px]" 
                onClick={() => handleSort("username")}
              >
                User {getSortIcon("username")}
              </TableHead>
              <TableHead 
                className="cursor-pointer min-w-[200px]" 
                onClick={() => handleSort("email")}
              >
                Email {getSortIcon("email")}
              </TableHead>
              <TableHead className="min-w-[150px]">Role</TableHead>
              <TableHead 
                className="cursor-pointer min-w-[120px]" 
                onClick={() => handleSort("createdAt")}
              >
                Registered {getSortIcon("createdAt")}
              </TableHead>
              <TableHead 
                className="cursor-pointer min-w-[100px]" 
                onClick={() => handleSort("points")}
              >
                Points {getSortIcon("points")}
              </TableHead>
              <TableHead 
                className="cursor-pointer min-w-[100px]" 
                onClick={() => handleSort("enabled")}
              >
                Status {getSortIcon("enabled")}
              </TableHead>
              <TableHead 
                className="cursor-pointer min-w-[120px]" 
                onClick={() => handleSort("lastLogin")}
              >
                Last Login {getSortIcon("lastLogin")}
              </TableHead>
              <TableHead className="min-w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-800">
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{user.username}</span>
                    </div>
                  </TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>{user.email}</TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.length > 0 ? (
                        user.roles.map((role) => {
                          console.log('Role:', role);
                          const { color, bgColor, icon: Icon } = getRoleBadgeStyle(role.name);
                          return (
                            <Badge 
                              key={role.id} 
                              className={`
                                ${color} ${bgColor}
                                flex items-center gap-1 px-2 py-1 
                                rounded-md font-medium text-xs
                                transition-colors duration-200
                              `}
                            >
                              <Icon className="h-3 w-3" />
                              {formatRoleName(role)}
                            </Badge>
                          )
                        })
                      ) : (
                        <Badge 
                          variant="outline" 
                          className="text-gray-400 border-gray-600"
                        >
                          No Role
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>{user.points.toLocaleString()}</TableCell>
                  <TableCell>
                    <Switch
                      checked={user.enabled}
                      onCheckedChange={(checked) => handleStatusChange(user.id, checked)}
                      onClick={(e) => e.stopPropagation()}
                      className={`
                        transition-colors duration-200
                        data-[state=checked]:bg-green-500
                        data-[state=unchecked]:bg-red-500/50
                        data-[state=checked]:hover:bg-green-600
                        data-[state=unchecked]:hover:bg-red-600/50
                        [&>span]:bg-white
                        [&>span]:translate-x-0
                        data-[state=checked]:[&>span]:translate-x-5
                      `}
                    />
                  </TableCell>
                  <TableCell onClick={() => onSelectUser(user.id)}>
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="hover:bg-[#3a4764]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="bg-[#2a3754] border border-gray-700 text-white min-w-[160px]"
                        style={{ backgroundColor: '#2a3754' }}
                      >
                        <DropdownMenuItem className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer">
                          <Eye className="mr-2 h-4 w-4" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-[#3a4764] focus:bg-[#3a4764] text-white cursor-pointer">
                          <Ban className="mr-2 h-4 w-4" /> Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="hover:bg-red-600/90 focus:bg-red-600/90 text-red-500 hover:text-white focus:text-white cursor-pointer"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t border-gray-700 bg-[#1a2744]">
        <div className="text-sm text-gray-400">
          {loading ? (
            "Loading..."
          ) : users && users.length > 0 ? (
            <>
              Showing {(currentPage * 10) + 1} to {Math.min((currentPage + 1) * 10, totalElements)} of {totalElements} users
            </>
          ) : (
            "No users found"
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0 || loading}
            className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764]"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1 || loading}
            className="bg-[#2a3754] border-gray-700 text-white hover:bg-[#3a4764]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

