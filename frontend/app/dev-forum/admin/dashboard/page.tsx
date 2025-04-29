"use client";

import { useState, useEffect } from "react";
import { AdminGuard } from "@/components/guards/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, FileText, ThumbsUp, Eye, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/api";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import { ForumHeader } from "@/components/forum-header";  

export default function BlogDashboard() {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [blogStats, setBlogStats] = useState<{
    total: number;
    published: number;
    rejected: number;
    pending: number;
    draft: number;
  }>({
    total: 0,
    published: 0,
    rejected: 0,
    pending: 0,
    draft: 0
  });
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch blog stats and recent blogs
  useEffect(() => {
    const fetchBlogData = async () => {
  try {
    setIsLoading(true);

    // Fetch blog statistics
    const statsResponse = await blogService.getBlogStats();
    if (statsResponse.data && statsResponse.data.success) {
      setBlogStats(statsResponse.data.data);
    } else {
      toast({
        title: "Error",
        description: "Failed to load blog statistics",
        variant: "destructive",
      });
    }

    // Fetch recent blogs (for recent activity section)
    const blogsResponse = await blogService.getAllBlogs();
    if (blogsResponse.data && blogsResponse.data.success) {
      // Support both paginated and non-paginated API responses
      let blogs = [];
      if (Array.isArray(blogsResponse.data.data)) {
        blogs = blogsResponse.data.data;
      } else if (blogsResponse.data.data && Array.isArray(blogsResponse.data.data.content)) {
        blogs = blogsResponse.data.data.content;
      }

      // Get the 3 most recent blogs
      const sortedBlogs = [...blogs].sort((a, b) =>
        new Date(b.lastUpdatedAt || b.createdAt).getTime() -
        new Date(a.lastUpdatedAt || a.createdAt).getTime()
      ).slice(0, 3);
      setRecentBlogs(sortedBlogs);
    } else {
      toast({
        title: "Error",
        description: "Failed to load recent blogs",
        variant: "destructive",
      });
    }
  } catch (error: any) {
    console.error("Error fetching blog data:", error);
    toast({
      title: "Error",
      description: error.response?.data?.message || "Failed to load blog data",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

    fetchBlogData();
  }, [toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Status color mapping
  const statusColors = {
    "PUBLISHED": "bg-green-500/20 text-green-500",
    "DRAFT": "bg-yellow-500/20 text-yellow-500",
    "ARCHIVED": "bg-gray-500/20 text-gray-500",
    "PENDING": "bg-orange-500/20 text-orange-500",
    "REJECTED": "bg-red-500/20 text-red-500"
  };

  return (
    <AdminGuard>
      <ForumHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center mb-8">
            
            <div>
              <h1 className="text-3xl font-bold mb-1 text-white">Blog Dashboard</h1>
              <p className="text-gray-300">
                Monitor blog statistics and review recent activity
              </p>
            </div>
          </div>

          {/* Admin actions nav */}
          <div className="mb-6 flex overflow-x-auto pb-2">
            <div className="flex space-x-2">
              <Link href="/dev-forum/admin/dashboard">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap bg-white/10"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/dev-forum/admin/blog-management">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap"
                >
                  Blog Management
                </Button>
              </Link>
              <Link href="/dev-forum/admin/blog-categories">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap"
                >
                  Blog Categories
                </Button>
              </Link>
            </div>
          </div>

          {/* Welcome card */}
          <div className="flex items-center mb-8 bg-white/5 p-6 rounded-lg backdrop-blur-sm border border-white/10 shadow-lg">
            <div className="mr-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                Welcome, {user?.username}
              </h1>
              <p className="text-slate-300 text-sm mt-1">Blog Administration Dashboard</p>
            </div>
          </div>

          {/* Blog Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 transform transition-all hover:scale-[0.99]">
            <Card className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                <FileText className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-white/20" />
                ) : (
                  <div className="text-2xl font-bold">{blogStats.total}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-white/20" />
                ) : (
                  <div className="text-2xl font-bold text-green-400">{blogStats.published}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-white/20" />
                ) : (
                  <div className="text-2xl font-bold text-red-400">{blogStats.rejected}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-white/20" />
                ) : (
                  <div className="text-2xl font-bold text-orange-400">{blogStats.pending}</div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <FileText className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-white/20" />
                ) : (
                  <div className="text-2xl font-bold text-yellow-400">{blogStats.draft}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8 bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle>Recent Blog Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <Skeleton className="h-16 w-full bg-white/20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentBlogs.length > 0 ? (
                    recentBlogs.map(blog => (
                      <div 
                        key={blog.id} 
                        className="flex flex-col justify-between h-full p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-medium mb-2">{blog.title}</div>
                          <div className="flex flex-wrap items-center mt-1 text-sm text-gray-400 space-x-4 mb-2">
                            <div>By {blog.authorUsername || blog.author?.username || "Unknown"}</div>
                            <div>Updated {formatDate(blog.lastUpdatedAt || blog.createdAt)}</div>
                          </div>
                          <div className="flex items-center space-x-4 mb-2">
                            <div className="flex items-center">
                              <ThumbsUp className="h-3.5 w-3.5 mr-1" /> {blog.likes || 0}
                            </div>
                            {blog.views !== undefined && (
                              <div className="flex items-center">
                                <Eye className="h-3.5 w-3.5 mr-1" /> {blog.views}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center mt-auto">
                          <Badge className={statusColors[blog.status]}>
                            {blog.status}
                          </Badge>
                          <Link href={`/dev-forum/blog/${blog.id}`} className="ml-2">
                            <Button variant="outline" size="sm" className="border-white/20 text-white">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-400 col-span-3">
                      No recent blog activity found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card className="mt-8 bg-white/10 backdrop-filter backdrop-blur-md border border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/dev-forum/admin/blog-management" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    Manage Blog Posts
                  </Button>
                </Link>
                <Link href="/dev-forum/admin/blog-categories" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Manage Categories
                  </Button>
                </Link>
                <Link href="/dev-forum/blog/new" className="block">
                  <Button 
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Create New Blog
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
