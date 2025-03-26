"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserStore } from "@/stores/useUserStore"

export function UserFilters() {
  const { filters, setFilters, fetchUsers, setCurrentPage } = useUserStore()

  const handleRoleChange = (role: string) => {
    const newFilters = {
      ...filters,
      roles: role === 'ALL' ? [] : [role]
    }
    setFilters(newFilters)
    setCurrentPage(0) // Reset to first page when filter changes
    fetchUsers()
  }

  const handleRegistrationDateChange = (value: string) => {
    const newFilters = {
      ...filters,
      registrationDate: value === 'all' ? null : value
    }
    setFilters(newFilters)
    setCurrentPage(0)
    fetchUsers()
  }

  const handlePointsChange = (value: number[]) => {
    const newFilters = {
      ...filters,
      minPoints: value[0],
      maxPoints: value[1]
    }
    setFilters(newFilters)
    setCurrentPage(0)
    fetchUsers()
  }

  const handleStatusChange = (enabled: boolean) => {
    const newFilters = {
      ...filters,
      enabled
    }
    setFilters(newFilters)
    setCurrentPage(0)
    fetchUsers()
  }

  const handleActivityLevelChange = (value: string) => {
    const newFilters = {
      ...filters,
      activityLevel: value === 'all' ? null : value
    }
    setFilters(newFilters)
    setCurrentPage(0)
    fetchUsers()
  }

  return (
    <Card className="bg-[#1a2744] border-gray-700 shadow-lg">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-lg font-semibold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">Role</Label>
          <Select
            value={filters.roles?.length ? filters.roles[0] : 'ALL'}
            onValueChange={handleRoleChange}
          >
            <SelectTrigger className="w-full bg-[#2a3754] border-gray-600 text-white focus:ring-purple-500 hover:bg-[#2f3f63] transition-colors">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent 
              className="bg-[#2a3754] border border-gray-600 shadow-xl"
              style={{ backgroundColor: '#2a3754' }}
            >
              {[
                { value: 'ALL', label: 'All' },
                { value: 'STUDENT', label: 'Student' },
                { value: 'INSTRUCTOR', label: 'Instructor' },
                { value: 'MODERATOR', label: 'Moderator' },
                { value: 'ADMIN', label: 'Admin' }
              ].map((item) => (
                <SelectItem 
                  key={item.value}
                  value={item.value} 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] cursor-pointer transition-colors"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">Registration Date</Label>
          <Select
            value={filters.registrationDate || 'all'}
            onValueChange={handleRegistrationDateChange}
          >
            <SelectTrigger className="w-full bg-[#2a3754] border-gray-600 text-white focus:ring-purple-500 hover:bg-[#2f3f63] transition-colors">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent 
              className="bg-[#2a3754] border border-gray-600 shadow-xl"
              style={{ backgroundColor: '#2a3754' }}
            >
              {[
                { value: 'all', label: 'All time' },
                { value: 'today', label: 'Today' },
                { value: 'week', label: 'This week' },
                { value: 'month', label: 'This month' }
              ].map((item) => (
                <SelectItem 
                  key={item.value}
                  value={item.value} 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] cursor-pointer transition-colors"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label className="text-sm font-medium text-gray-300">Points Range</Label>
          <div className="pt-4">
            <Slider
              min={0}
              max={5000}
              step={100}
              value={[filters.minPoints || 0, filters.maxPoints || 5000]}
              onValueChange={([min, max]) => {
                setFilters({
                  ...filters,
                  minPoints: min,
                  maxPoints: max,
                })
              }}
              className="relative flex items-center select-none touch-none w-full [&>span]:block [&>span]:w-6 [&>span]:h-6 [&>span]:bg-white [&>span]:rounded-full [&>span]:border-4 [&>span]:border-purple-600 [&>span]:hover:border-purple-500 [&>span]:transition-all [&>span]:shadow-lg [&>span]:cursor-grab [&>span]:active:cursor-grabbing [&_[role=slider]]:h-2 [&_[role=slider]]:grow [&_[role=slider]]:rounded-full [&_[role=slider]]:bg-purple-600"
            />
            <div className="flex justify-between mt-4 text-sm text-gray-400">
              <span>{filters.minPoints || 0}</span>
              <span>{filters.maxPoints || 5000}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">Status</Label>
          <div className="flex items-center justify-between bg-[#2a3754] p-3 rounded-md border border-gray-600">
            <span className="text-sm text-gray-300">Active</span>
            <Switch
              checked={filters.enabled}
              onCheckedChange={handleStatusChange}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500 data-[state=unchecked]:bg-gray-600 h-6 w-11 rounded-full [&>span]:rounded-full [&>span]:shadow-sm [&>span]:h-5 [&>span]:w-5 [&>span]:translate-x-0.5 data-[state=checked]:[&>span]:translate-x-5"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-200">Activity Level</Label>
          <Select
            value={filters.activityLevel || 'all'}
            onValueChange={handleActivityLevelChange}
          >
            <SelectTrigger className="w-full bg-[#2a3754] border-gray-600 text-white focus:ring-purple-500 hover:bg-[#2f3f63] transition-colors">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent 
              className="bg-[#2a3754] border border-gray-600 shadow-xl"
              style={{ backgroundColor: '#2a3754' }}
            >
              {[
                { value: 'all', label: 'All' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
                { value: 'inactive', label: 'Inactive' }
              ].map((item) => (
                <SelectItem 
                  key={item.value}
                  value={item.value} 
                  className="text-white hover:bg-[#3a4764] focus:bg-[#3a4764] cursor-pointer transition-colors"
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

