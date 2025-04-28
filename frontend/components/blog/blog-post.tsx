import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Eye,
    Bookmark,
    Share2,
    Calendar,
    Clock,
    Tag,
    ArrowLeft,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/useAuthStore";

// Category to color mapping
const categoryColors = {
    "GENERAL": "bg-gray-500/20 text-gray-500",
    "TECHNOLOGY": "bg-blue-500/20 text-blue-500",
    "PROGRAMMING": "bg-green-500/20 text-green-500",
    "DESIGN": "bg-purple-500/20 text-purple-500",
    "CAREER": "bg-orange-500/20 text-orange-500",
    "TUTORIAL": "bg-pink-500/20 text-pink-500",
    "REVIEW": "bg-cyan-500/20 text-cyan-500",
    "NEWS": "bg-indigo-500/20 text-indigo-500",
    "PROJECT_SHOWCASE": "bg-yellow-500/20 text-yellow-500",
    "COMMUNITY": "bg-red-500/20 text-red-500"
};

// Status to color mapping
const statusColors = {
    "PUBLISHED": "bg-green-500/20 text-green-500",
    "DRAFT": "bg-yellow-500/20 text-yellow-500",
    "ARCHIVED": "bg-gray-500/20 text-gray-500",
    "PENDING": "bg-orange-500/20 text-orange-500",
    "REJECTED": "bg-red-500/20 text-red-500"
};

// Format the date
const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// No comment component needed

// Sample related posts - Would be replaced with API data in production
const sampleRelatedPosts = [
    {
        id: "r1",
        title: "Advanced Patterns",
        excerpt: "Take your knowledge to the next level with these advanced patterns.",
        category: "Frontend",
        publishedAt: "2023-12-01T10:15:00Z"
    },
    {
        id: "r2",
        title: "State Management",
        excerpt: "Compare different state management solutions for applications.",
        category: "Frontend",
        publishedAt: "2023-11-28T15:45:00Z"
    },
    {
        id: "r3",
        title: "Building Custom Hooks",
        excerpt: "Learn how to create reusable logic with custom hooks.",
        category: "Frontend",
        publishedAt: "2023-12-10T08:30:00Z"
    }
];

export function BlogPost(props: { blog: any }) {
    const { blog } = props;
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated, user } = useAuthStore();
    const [liked, setLiked] = useState(blog?.hasLiked || false);
    const [likesCount, setLikesCount] = useState(blog?.likes || 0);
    const [bookmarked, setBookmarked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Check if current user is the author of the blog
    const isAuthor = user && blog?.authorId === user.id;
    
    // Check if user is admin or moderator
    const isAdmin = user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_MODERATOR'));


    // Update liked state when blog changes
    useEffect(() => {
        if (blog) {
            setLiked(blog.hasLiked || false);
            setLikesCount(blog.likes || 0);
        }
    }, [blog]);

    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to like posts",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await blogService.toggleLike(blog.id);
            if (response.data && response.data.success) {
                const updatedBlog = response.data.data;
                setLiked(updatedBlog.hasLiked);
                setLikesCount(updatedBlog.likes);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            toast({
                title: "Error",
                description: "Failed to update like status",
                variant: "destructive",
            });
        }
    };
    
    // Submit blog for review
    const handleSubmitForReview = async () => {
        if (!isAuthenticated || !isAuthor) {
            toast({
                title: "Permission Denied",
                description: "Only the author can submit this blog for review",
                variant: "destructive",
            });
            return;
        }
        
        setIsSubmitting(true);
        try {
            const response = await blogService.submitForReview(blog.id);
            if (response.data && response.data.success) {
                toast({
                    title: "Success",
                    description: "Blog submitted for review. It will be published after approval.",
                    variant: "default",
                });
                // Update blog status in UI
                blog.status = "PENDING";
            }
        } catch (error) {
            console.error("Error submitting blog for review:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to submit blog for review",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // Handle blog approval
    const handleApproveBlog = async () => {
        if (!isAdmin) {
            toast({
                title: "Access Denied",
                description: "Only admins can approve blogs",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsProcessing(true);
            const response = await blogService.approveBlog(blog.id);

            if (response.data && response.data.success) {
                toast({
                    title: "Success",
                    description: "Blog approved and published",
                    variant: "default",
                });
                
                // Redirect to admin panel or refresh the page
                router.push('/dev-forum/admin/blog-management');
            } else {
                throw new Error("Failed to approve blog");
            }
        } catch (error) {
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
    
    // Reject a pending blog (admin only)
    const handleRejectBlog = async () => {
        if (!isAdmin) {
            toast({
                title: "Permission Denied",
                description: "Only administrators can reject blogs",
                variant: "destructive",
            });
            return;
        }
        
        // Get rejection reason
        const reason = prompt("Please provide a reason for rejection:");
        if (!reason) return; // Cancelled

        setIsProcessing(true);
        try {
            const response = await blogService.rejectBlog(blog.id, reason);
            if (response.data && response.data.success) {
                toast({
                    title: "Success",
                    description: "Blog has been rejected",
                    variant: "default",
                });
                
                // Redirect to admin panel
                router.push('/dev-forum/admin/blog-management');
            }
        } catch (error) {
            console.error("Error rejecting blog:", error);
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to reject blog",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    }

    // Parse HTML content (in a real app, use a proper HTML parser or markdown)
    const createMarkup = (html: string) => {
        return { __html: html }
    }

    if (!blog) {
        return <div className="text-white">Loading blog post...</div>;
    }

    return (
        <div 
            className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4"
        >
            <div className="container mx-auto max-w-4xl">
                {/* Back button */}
                <button
                    onClick={() => router.push("/dev-forum/blog")}
                    className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 inline-block"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to all posts
                </button>

                {/* Blog header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <Badge className={`${categoryColors[blog.category] || 'bg-gray-500/20 text-gray-500'} px-2 py-1`}>
                                {blog.category}
                            </Badge>
                            <Badge className={`${statusColors[blog.status || (blog.published ? 'PUBLISHED' : 'DRAFT')] || 'bg-gray-500/20 text-gray-500'} ml-2 px-2 py-1`}>
                                {blog.status || (blog.published ? 'PUBLISHED' : 'DRAFT')}
                            </Badge>
                            {blog.status === 'REJECTED' && blog.rejectionReason && (
                                <div className="mt-2 bg-red-500/10 border border-red-500/20 text-red-400 p-2 rounded-md text-sm">
                                    <strong>Reason for rejection:</strong> {blog.rejectionReason}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-2">
                        {blog.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={blog.authorAvatarUrl} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                    {blog.authorUsername?.[0]?.toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-cyan-400 font-medium">{blog.authorUsername}</p>
                                <p className="text-xs">Author</p>
                            </div>
                        </div>

                        <Separator orientation="vertical" className="h-8 bg-white/20" />

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <span>Published: {formatDate(blog.publishedAt || blog.createdAt)}</span>
                        </div>

                        {blog.lastUpdatedAt && blog.lastUpdatedAt !== blog.createdAt && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4 text-cyan-400" />
                                <span>Updated: {formatDate(blog.lastUpdatedAt)}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Blog content */}
                    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                        <CardContent className="p-6 md:p-8">
                            <div className="prose prose-invert max-w-none">
                                {/* Using pre-wrap to preserve line breaks in the content */}
                                <div style={{ whiteSpace: "pre-wrap" }}>{blog.content}</div>
                            </div>

                            {/* Tags */}
                            {blog.tags && blog.tags.length > 0 && (
                                <div className="mt-8 flex flex-wrap gap-2">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                    {blog.tags.map(tag => (
                                        <span key={tag} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Engagement buttons */}
                            <div className="mt-8 flex justify-between items-center border-t border-b border-white/10 py-4">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        className={`flex items-center gap-2 ${liked ? 'text-pink-500' : 'text-white'}`}
                                        onClick={handleToggleLike}
                                    >
                                        <Heart className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
                                        <span>{likesCount} likes</span>
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        className={`${bookmarked ? 'text-cyan-500' : 'text-white'}`}
                                        onClick={() => setBookmarked(!bookmarked)}
                                    >
                                        <Bookmark className="h-5 w-5" fill={bookmarked ? 'currentColor' : 'none'} />
                                        <span className="sr-only">Bookmark</span>
                                    </Button>

                                    <Button variant="ghost" className="text-white">    
                                        <Share2 className="h-5 w-5" />
                                        <span className="sr-only">Share</span>
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Blog action buttons based on status and user role */}
                            {isAuthor && blog.status === 'DRAFT' && (
                                <Button 
                                    onClick={handleSubmitForReview}
                                    disabled={isSubmitting}
                                    className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white">
                                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                                </Button>
                            )}
                            
                            {isAdmin && blog.status === 'PENDING' && (
                                <div className="mt-4 flex gap-2">
                                    <Button 
                                        onClick={handleApproveBlog}
                                        disabled={isProcessing}
                                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white">
                                        {isProcessing ? "Processing..." : "Approve"}
                                    </Button>
                                    <Button 
                                        onClick={handleRejectBlog}
                                        disabled={isProcessing}
                                        variant="outline"
                                        className="border-red-500/50 text-red-500 hover:bg-red-500/10">
                                        {isProcessing ? "Processing..." : "Reject"}
                                    </Button>
                                </div>
                            )}

                            {/* Author bio */}
                            <div className="mt-8 bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarImage src={blog.authorAvatarUrl} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                            {blog.authorUsername?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-lg font-medium text-cyan-400">{blog.authorUsername}</h3>
                                        <p className="text-sm text-gray-300">Author bio would appear here</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                {/* Related posts */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sampleRelatedPosts.map((post) => (
                            <Card key={post.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-4">
                                    <Badge className={`${categoryColors[post.category]} px-2 py-0.5 mb-2`}>
                                        {post.category}
                                    </Badge>
                                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</span>
                                        <button
                                            onClick={() => router.push(`/dev-forum/blog/${post.id}`)}
                                            className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center"
                                        >
                                            Read <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Prev/Next navigation */}
                <div className="flex justify-between items-center">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous Post
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Next Post <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    </div>
    )
}