"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from "@/components/guards/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Eye, Search, X, AlertCircle, Loader, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { blogService } from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import { ForumHeader } from "@/components/forum-header";

// Status to color mapping
const statusColors = {
  "PUBLISHED": "bg-green-500/20 text-green-500",
  "DRAFT": "bg-yellow-500/20 text-yellow-500",
  "ARCHIVED": "bg-gray-500/20 text-gray-500",
  "PENDING": "bg-orange-500/20 text-orange-500",
  "REJECTED": "bg-red-500/20 text-red-500"
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function BlogManagement() {
  const router = useRouter();
  const { toast } = useToast();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRejectionDialogOpen, setIsRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch blogs data
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching all blogs for management');
        
        // Debugging - log the original service function
        console.log('getAllBlogs method:', blogService.getAllBlogs);
        
        const response = await blogService.getAllBlogs(0, 100); // Fetch all (or increase page size as needed)
        console.log('API Response:', response);

        if (response.data && response.data.success) {
          // Support both paged and non-paged responses
          const data = response.data.data;
          const blogsArray = (data && Array.isArray(data.content)) ? data.content : data;

          console.log('Blog data received:', blogsArray);
          // Ensure we always store an array to avoid runtime errors
          setBlogs(Array.isArray(blogsArray) ? blogsArray : []);
        } else {
          console.error('API returned success=false:', response.data);
          toast({
            title: "Error",
            description: "Failed to load blogs",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching blogs:", error);
        // Debug the error details
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
          }
        });
        
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to load blogs",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [toast]);

  // Filter blogs based on search term
  const filteredBlogs = Array.isArray(blogs) ? blogs.filter(blog => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(term) ||
      blog.authorUsername?.toLowerCase().includes(term) ||
      blog.category?.toLowerCase().includes(term) ||
      blog.status?.toLowerCase().includes(term)
    );
  }) : []; // Default to empty array if blogs is not an array

  // Handle blog approval
  const handleApproveBlog = async (blogId: string) => {
    try {
      setIsProcessing(true);
      const response = await blogService.approveBlog(blogId);

      if (response.data && response.data.success) {
        toast({
          title: "Success",
          description: "Blog approved and published",
          variant: "default",
        });

        // Update blogs list
        setBlogs(blogs.map(blog => 
          blog.id === blogId ? { ...blog, status: "PUBLISHED" } : blog
        ));
      } else {
        throw new Error("Failed to approve blog");
      }
    } catch (error: any) {
      console.error("Error approving blog:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to approve blog",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle blog rejection dialog
  const openRejectionDialog = (blogId: string) => {
    setSelectedBlogId(blogId);
    setRejectionReason("");
    setIsRejectionDialogOpen(true);
  };

  // Handle blog rejection
  const handleRejectBlog = async () => {
    if (!rejectionReason.trim() || !selectedBlogId) {
      toast({
        title: "Validation Error",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const response = await blogService.rejectBlog(selectedBlogId, rejectionReason);

      if (response.data && response.data.success) {
        toast({
          title: "Success",
          description: "Blog rejected",
          variant: "default",
        });

        // Update blogs list
        setBlogs(blogs.map(blog => 
          blog.id === selectedBlogId ? { ...blog, status: "REJECTED", rejectionReason } : blog
        ));
        setIsRejectionDialogOpen(false);
      } else {
        throw new Error("Failed to reject blog");
      }
    } catch (error: any) {
      console.error("Error rejecting blog:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to reject blog",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminGuard>
      <ForumHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="container max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-1 text-white">Blog Management</h1>
              <p className="text-gray-300">
                Review, approve, reject, and manage blog posts submitted by users.
              </p>
            </div>
          </div>

          {/* Admin actions nav */}
          <div className="mb-6 flex overflow-x-auto pb-2">
            <div className="flex space-x-2">
              <Link href="/dev-forum/admin/dashboard">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/dev-forum/admin/blog-management">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap bg-white/10"
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

          {/* Search and filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search blogs by title, author or category..."
                  className="bg-gray-800 border-gray-700 pl-10 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                onClick={() => router.push("/dev-forum/blog/new")}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
              >
                Create New Blog
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              <Loader className="animate-spin h-8 w-8 mb-4" />
              <p className="text-white">Loading blogs...</p>
            </div>
          ) : (
            <>
              {filteredBlogs.length === 0 ? (
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
                  <CardContent className="p-8 text-center">
                    <p className="text-lg text-gray-300">No blogs found matching your criteria.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredBlogs.map(blog => (
                    <Card key={blog.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none hover:bg-opacity-15 transition-all">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex-grow mb-4 md:mb-0">
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={`${statusColors[blog.status]} px-2 py-0.5`}>
                                {blog.status}
                              </Badge>
                              {blog.category && (
                                <Badge variant="outline" className="border-white/20 text-white px-2 py-0.5">
                                  {blog.category}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-white">{blog.title}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                              <span>By: {blog.authorUsername}</span>
                              <span>Created: {formatDate(blog.createdAt)}</span>
                              <span>Updated: {formatDate(blog.lastUpdatedAt || blog.createdAt)}</span>
                              {/* Only show view count if supported by backend */}
                              {blog.views !== undefined && (
                                <span>Views: {blog.views}</span>
                              )}
                            </div>
                            {blog.status === "REJECTED" && blog.rejectionReason && (
                              <div className="mt-3 bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-md text-sm">
                                <strong>Rejection reason:</strong> {blog.rejectionReason}
                              </div>
                            )}
                          </div>
                          <div className="flex items-start gap-2 md:flex-col lg:flex-row">
                            <Button
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                              onClick={() => router.push(`/dev-forum/blog/${blog.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" /> View
                            </Button>
                            
                            {blog.status === "PENDING" && (
  <div className="flex gap-2">
    <Button
      onClick={() => handleApproveBlog(blog.id)}
      disabled={isProcessing}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <Check className="h-4 w-4 mr-2" /> Approve
    </Button>
    <Button
      onClick={() => openRejectionDialog(blog.id)}
      disabled={isProcessing}
      className="bg-red-600 hover:bg-red-700 text-white"
    >
      <X className="h-4 w-4 mr-2" /> Reject
    </Button>
  </div>
)}
{blog.status === "PUBLISHED" && (
  <div className="flex gap-2">
    <Button
      onClick={() => openRejectionDialog(blog.id)}
      disabled={isProcessing}
      className="bg-red-600 hover:bg-red-700 text-white"
    >
      <X className="h-4 w-4 mr-2" /> Reject
    </Button>
  </div>
)}
{blog.status === "REJECTED" && (
  <div className="flex gap-2">
    <Button
      onClick={() => handleApproveBlog(blog.id)}
      disabled={isProcessing}
      className="bg-green-600 hover:bg-green-700 text-white"
    >
      <Check className="h-4 w-4 mr-2" /> Approve
    </Button>
  </div>
)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Rejection Dialog */}
        <Dialog open={isRejectionDialogOpen} onOpenChange={setIsRejectionDialogOpen}>
          <DialogContent className="bg-gray-900 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Reject Blog</DialogTitle>
              <DialogDescription className="text-gray-400">
                Please provide a reason for rejecting this blog post.
                This will be visible to the author.
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 p-3 rounded-md flex items-start mb-4">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  Be constructive in your feedback to help the author improve their post.
                </p>
              </div>
              
              <Input
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason for rejection"
                className="bg-gray-800 border-white/10 text-white"
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsRejectionDialogOpen(false)}
                className="border-white/20 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRejectBlog}
                disabled={isProcessing || !rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isProcessing ? "Processing..." : "Reject Blog"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>
    </AdminGuard>
  );
}
