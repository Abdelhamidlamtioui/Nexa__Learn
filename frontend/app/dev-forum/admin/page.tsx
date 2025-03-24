"use client"

import { useEffect } from "react"
import { AdminGuard } from "@/components/guards/AdminGuard"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/useAuthStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ForumHeader } from "@/components/forum-header"

export default function AdminDashboardPage() {
  const { user, checkIsAdmin } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    // Log authentication status for debugging
    console.log("Admin Dashboard accessed by:", user)
    console.log("Admin check result:", checkIsAdmin())
    console.log("User roles:", user?.roles)
    
    // Display a toast notification for debugging
    toast({
      title: "Admin Dashboard",
      description: `User: ${user?.username || 'Not logged in'}, Admin: ${checkIsAdmin() ? 'Yes' : 'No'}`,
    })
  }, [user, checkIsAdmin, toast])

  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-deep-navy to-rich-purple text-white">
        <ForumHeader />
        
        <main className="flex-grow container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your platform settings and users</p>
            
            {/* Debug section */}
            <Card className="mt-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
              <CardHeader>
                <CardTitle>Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>Username:</strong> {user?.username || 'Not available'}</p>
                  <p><strong>User ID:</strong> {user?.id || 'Not available'}</p>
                  <p><strong>Is Admin:</strong> {checkIsAdmin() ? 'Yes' : 'No'}</p>
                  <p><strong>Roles:</strong> {user?.roles ? JSON.stringify(user.roles) : 'None'}</p>
                </div>
                <Button 
                  onClick={() => {
                    useAuthStore.setState(state => ({
                      ...state,
                      user: {
                        ...state.user!,
                        roles: ['ADMIN']
                      }
                    }))
                    toast({
                      title: "Admin Role Added",
                      description: "Temporary admin role has been added for testing"
                    })
                  }}
                  className="mt-4"
                >
                  Grant Temporary Admin Access
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 bg-white bg-opacity-10">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5,240</div>
                    <p className="text-gray-300">Total registered users</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                  <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">10.5M</div>
                    <p className="text-gray-300">Tokens in circulation</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">357</div>
                    <p className="text-gray-300">Pending approvals</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>User management functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                <CardHeader>
                  <CardTitle>Content Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Content moderation functionality will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings">
              <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Platform settings will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  )
} 