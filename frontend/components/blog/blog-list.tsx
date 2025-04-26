import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye, Bookmark, Calendar, User, Clock, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

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

export function BlogList() {
    const router = useRouter();
    const { toast } = useToast();
    const [filter, setFilter] = useState("All");
    const [blogs, setBlogs] = useState([]);
    const [featuredBlog, setFeaturedBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    // Categories for filtering
    const categories = ["All", "GENERAL", "TECHNOLOGY", "PROGRAMMING", "DESIGN", "CAREER", "TUTORIAL", "REVIEW", "NEWS", "PROJECT_SHOWCASE", "COMMUNITY"];

    // Fetch blogs from API
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);

                // Fetch the most popular blog for the featured section
                if (page === 0) {
                    try {
                        const popularResponse = await blogService.getPopularBlogs(0, 1);
                        if (popularResponse.data && popularResponse.data.success &&
                            popularResponse.data.data.content &&
                            popularResponse.data.data.content.length > 0) {
                            setFeaturedBlog(popularResponse.data.data.content[0]);
                        }
                    } catch (error) {
                        console.error("Error fetching popular blog:", error);
                    }
                }

                // Fetch blogs based on filter
                let response;
                if (filter === "All") {
                    response = await blogService.getPublishedBlogs(page, 6);
                } else {
                    // Filter published blogs by category on the client-side
                    // First get all published blogs
                    response = await blogService.getPublishedBlogs(page, 20);
                    
                    // Then filter by category if the response is successful
                    if (response.data && response.data.success) {
                        const allBlogs = response.data.data.content;
                        const filteredBlogs = allBlogs.filter(blog => blog.category === filter);
                        
                        // Replace the content with filtered blogs
                        response.data.data.content = filteredBlogs;
                    }
                }

                if (response.data && response.data.success) {
                    const responseData = response.data.data;

                    // If it's the first page, replace the blogs array
                    // Otherwise, append to the existing blogs
                    if (page === 0) {
                        setBlogs(responseData.content);
                    } else {
                        setBlogs(prevBlogs => [...prevBlogs, ...responseData.content]);
                    }

                    setTotalPages(responseData.totalPages);
                    setHasMore(!responseData.last);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to load blogs",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
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
    }, [filter, page, toast]);

    // Handle filter change
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        setPage(0); // Reset to first page when changing filter
        setBlogs([]); // Clear blogs when changing filter
    };

    // Handle load more
    const handleLoadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    // Navigate to blog post
    const navigateToBlog = (id) => {
        router.push(`/dev-forum/blog/${id}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-2">
                    Developer Blog
                </h1>
                <p className="text-xl text-gray-300 mb-8">Insights, tutorials, and community highlights</p>

                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={filter === category ? "default" : "outline"}
                            onClick={() => handleFilterChange(category)}
                            className={`rounded-full ${filter === category ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-none' : 'text-white border-white/20 hover:bg-white/10'}`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Featured blog */}
                {featuredBlog && (
                    <Card key={featuredBlog.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8 overflow-hidden">
                        <div className="md:flex">
                            <div className="flex-1 p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className={`${featuredBlog.category ? categoryColors[featuredBlog.category] : 'bg-gray-500/20 text-gray-500'} px-2 py-0.5`}>
                                        {featuredBlog.category || "General"}
                                    </Badge>
                                    <Badge className={`${featuredBlog.published ? statusColors.Published : statusColors.Draft} px-2 py-0.5`}>
                                        {featuredBlog.published ? "Published" : "Draft"}
                                    </Badge>
                                    <Badge className="bg-cyan-500/20 text-cyan-500 px-2 py-0.5">
                                        Featured
                                    </Badge>
                                </div>

                                <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-400">
                                    {featuredBlog.title}
                                </h2>

                                <p className="text-gray-300 mb-4 text-lg">
                                    {featuredBlog.content.length > 150
                                        ? featuredBlog.content.substring(0, 150) + "..."
                                        : featuredBlog.content}
                                </p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={featuredBlog.authorAvatarUrl} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                                {featuredBlog.authorUsername?.[0]?.toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-cyan-400">{featuredBlog.authorUsername}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(featuredBlog.publishedAt || featuredBlog.createdAt)}</span>
                                    </div>
                                </div>

                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                                    onClick={() => navigateToBlog(featuredBlog.id)}
                                >
                                    Read Full Article <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            <div className="md:w-1/3 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex items-center justify-center p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-pink-500" />
                                        <span>{featuredBlog.likes || 0} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-cyan-500" />
                                        <span>Comments coming soon</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-blue-500" />
                                        <span>Views coming soon</span>
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            variant="outline"
                                            className="w-full border-white/20 hover:bg-white/10"
                                            onClick={() => navigateToBlog(featuredBlog.id)}
                                        >
                                            <Bookmark className="mr-2 h-4 w-4" /> Save for later
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Loading indicator */}
                {isLoading && page === 0 && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-xl text-white">Loading blogs...</div>
                    </div>
                )}

                {/* No blogs message */}
                {!isLoading && blogs.length === 0 && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-xl text-white">No blogs found for this category</div>
                    </div>
                )}

                {/* Regular blog list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(blog => (
                        <Card
                            key={blog.id}
                            className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none transition-all duration-300 hover:shadow-lg hover:scale-[1.01] cursor-pointer ${blog.featured ? "border-l-4 border-cyan-500" : ""}`}
                            onClick={() => navigateToBlog(blog.id)}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center mb-2">
                                    <Badge className={`${blog.category ? categoryColors[blog.category] : 'bg-gray-500/20 text-gray-500'} px-2 py-0.5`}>
                                        {blog.category || "General"}
                                    </Badge>
                                    <Badge className={`${blog.published ? statusColors.Published : statusColors.Draft} px-2 py-0.5`}>
                                        {blog.published ? "Published" : "Draft"}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={blog.authorAvatarUrl} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                                            {blog.authorUsername?.[0]?.toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-cyan-400">{blog.authorUsername}</span>
                                    <span className="text-gray-400 text-xs">•</span>
                                    <span className="text-gray-400 text-xs">{formatDate(blog.publishedAt || blog.createdAt)}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-2">
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                    {blog.content}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags && blog.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1 text-xs text-pink-500">
                                            <Heart className="h-3 w-3" /> {blog.likes || 0}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-cyan-500">
                                            <MessageCircle className="h-3 w-3" /> 0
                                        </span>
                                    </div>

                                    <span className="text-white/80 hover:text-white text-sm flex items-center">
                                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Load more button */}
                {!isLoading && blogs.length > 0 && hasMore && (
                    <div className="flex justify-center mt-8">
                        <Button
                            onClick={handleLoadMore}
                            className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white"
                        >
                            {isLoading ? "Loading..." : "Load More"}
                        </Button>
                    </div>
                )}

                {/* Loading indicator for "load more" */}
                {isLoading && page > 0 && (
                    <div className="flex justify-center mt-8">
                        <div className="text-white">Loading more blogs...</div>
                    </div>
                )}
            </div>
        </div>
    );
}