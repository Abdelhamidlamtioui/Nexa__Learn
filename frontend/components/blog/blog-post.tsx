import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MessageCircle,
    Eye,
    Bookmark,
    Share2,
    ThumbsUp,
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
    "Frontend": "bg-blue-500/20 text-blue-500",
    "Backend": "bg-green-500/20 text-green-500",
    "CSS": "bg-purple-500/20 text-purple-500",
    "DevOps": "bg-orange-500/20 text-orange-500",
    "Mobile": "bg-pink-500/20 text-pink-500",
    "AI/ML": "bg-cyan-500/20 text-cyan-500",
    "UI/UX": "bg-indigo-500/20 text-indigo-500",
    "Database": "bg-yellow-500/20 text-yellow-500"
};

// Status to color mapping
const statusColors = {
    "Published": "bg-green-500/20 text-green-500",
    "Draft": "bg-yellow-500/20 text-yellow-500",
    "Archived": "bg-gray-500/20 text-gray-500",
    "Under Review": "bg-orange-500/20 text-orange-500"
};

// Format the date
const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Comment component
const Comment = ({ comment }) => (
    <div className="mb-6">
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                    {comment.author.username[0].toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.username}</span>
                    <span className="text-gray-400 text-xs">{formatDate(comment.date)}</span>
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-400 hover:text-cyan-400 text-xs flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {comment.likes} Likes
                    </button>
                    <button className="text-gray-400 hover:text-cyan-400 text-xs flex items-center gap-1">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    </div>
);

// Sample comments - This would be replaced with API data in a production environment
const sampleComments = [
    {
        id: "c1",
        author: {
            username: "jsdev123",
            avatar: "/avatars/02.png"
        },
        content: "Great article! The explanation is particularly helpful. I've been struggling with that concept.",
        date: "2023-12-16T10:30:00Z",
        likes: 8
    },
    {
        id: "c2",
        author: {
            username: "webcodeguru",
            avatar: ""
        },
        content: "Have you considered adding more examples? Those are often misunderstood.",
        date: "2023-12-16T14:45:00Z",
        likes: 5
    }
];

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

export function BlogPost({ blog }) {
    const router = useRouter();
    const { toast } = useToast();
    const { isAuthenticated } = useAuthStore();
    const [liked, setLiked] = useState(blog?.hasLiked || false);
    const [likesCount, setLikesCount] = useState(blog?.likes || 0);
    const [bookmarked, setBookmarked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSubmitComment = () => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to comment",
                variant: "destructive",
            });
            return;
        }

        if (!commentText.trim()) {
            toast({
                title: "Empty Comment",
                description: "Please enter a comment",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);
        // This would be replaced with an actual API call
        setTimeout(() => {
            toast({
                title: "Comment Posted",
                description: "Your comment has been posted successfully",
            });
            setCommentText("");
            setIsSubmitting(false);
        }, 1000);
    };

    // Parse HTML content (in a real app, use a proper HTML parser or markdown)
    const createMarkup = (html) => {
        return { __html: html };
    };

    if (!blog) {
        return <div className="text-white">Loading blog post...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
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
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.category && (
                            <Badge className={`${categoryColors[blog.category] || 'bg-gray-500/20 text-gray-500'} px-2 py-0.5`}>
                                {blog.category || "Uncategorized"}
                            </Badge>
                        )}
                        <Badge className={`${blog.published ? statusColors.Published : statusColors.Draft} px-2 py-0.5`}>
                            {blog.published ? "Published" : "Draft"}
                        </Badge>
                        {blog.tags && blog.tags.length > 0 && (
                            <Badge key={blog.tags[0]} variant="outline" className="text-white border-white/20">
                                {blog.tags[0]}
                            </Badge>
                        )}
                    </div>

                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-2">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
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

                        <Separator orientation="vertical" className="h-8 bg-white/20" />

                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span>Views coming soon</span>
                        </div>
                    </div>
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

                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-white"
                                    onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span>Comments</span>
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

                {/* Comments section */}
                <div id="comments-section" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Comments</h2>

                    {/* Comment form */}
                    <div className="mb-8">
                        <textarea
                            className="w-full p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Add a comment..."
                            rows={4}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        <Button
                            className="mt-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                            onClick={handleSubmitComment}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-6">
                        {sampleComments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                        {sampleComments.length === 0 && (
                            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                </div>

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
    );
}