import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Eye, Bookmark, Calendar, User, Clock, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Sample blog data
const sampleBlogs = [
    {
        id: "1",
        title: "Getting Started with React Hooks",
        excerpt: "Learn how to use React Hooks to simplify your components and manage state more effectively.",
        content: "React Hooks are a powerful feature that allows you to use state and other React features without writing a class...",
        author: {
            id: "a1",
            username: "reactninja",
            avatar: "/avatars/01.png"
        },
        category: "Frontend",
        tags: ["React", "JavaScript", "Web Development"],
        publishedAt: "2023-12-15T09:30:00Z",
        readTime: "5 min read",
        likes: 42,
        comments: 12,
        views: 1024,
        featured: true,
        status: "Published"
    },
    {
        id: "2",
        title: "Building RESTful APIs with Node.js and Express",
        excerpt: "A comprehensive guide to building robust REST APIs using Node.js and Express framework.",
        content: "Express is a minimal and flexible Node.js web application framework that provides a robust set of features...",
        author: {
            id: "a2",
            username: "backenddev",
            avatar: ""
        },
        category: "Backend",
        tags: ["Node.js", "Express", "API", "REST"],
        publishedAt: "2023-12-10T14:45:00Z",
        readTime: "8 min read",
        likes: 38,
        comments: 9,
        views: 876,
        featured: false,
        status: "Published"
    },
    {
        id: "3",
        title: "Mastering CSS Grid Layout",
        excerpt: "Deep dive into CSS Grid and learn how to create complex layouts with ease.",
        content: "CSS Grid Layout is a two-dimensional layout system designed specifically for user interface design...",
        author: {
            id: "a3",
            username: "cssartist",
            avatar: "/avatars/03.png"
        },
        category: "CSS",
        tags: ["CSS", "Web Design", "Layout"],
        publishedAt: "2023-12-05T11:20:00Z",
        readTime: "6 min read",
        likes: 29,
        comments: 7,
        views: 732,
        featured: false,
        status: "Draft"
    },
    {
        id: "4",
        title: "Introduction to Docker for Developers",
        excerpt: "Learn how Docker can simplify your development workflow and improve deployment consistency.",
        content: "Docker is an open platform for developing, shipping, and running applications in containers...",
        author: {
            id: "a4",
            username: "devopsmaster",
            avatar: ""
        },
        category: "DevOps",
        tags: ["Docker", "Containers", "DevOps"],
        publishedAt: "2023-12-01T10:15:00Z",
        readTime: "9 min read",
        likes: 56,
        comments: 15,
        views: 1245,
        featured: true,
        status: "Published"
    }
];

// Category to color mapping
const categoryColors = {
    "Frontend": "bg-blue-500/20 text-blue-500",
    "Backend": "bg-green-500/20 text-green-500",
    "CSS": "bg-purple-500/20 text-purple-500",
    "DevOps": "bg-orange-500/20 text-orange-500",
    "Mobile": "bg-pink-500/20 text-pink-500",
    "AI": "bg-cyan-500/20 text-cyan-500",
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
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export function BlogList() {
    const [filter, setFilter] = useState("All");

    // Categories for filtering
    const categories = ["All", "Frontend", "Backend", "DevOps", "CSS"];

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
                            onClick={() => setFilter(category)}
                            className={`rounded-full ${filter === category ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white border-none' : 'text-white border-white/20 hover:bg-white/10'}`}
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* Featured blog */}
                {sampleBlogs.filter(blog => blog.featured).slice(0, 1).map(blog => (
                    <Card key={blog.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8 overflow-hidden">
                        <div className="md:flex">
                            <div className="flex-1 p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge className={`${categoryColors[blog.category]} px-2 py-0.5`}>
                                        {blog.category}
                                    </Badge>
                                    <Badge className={`${statusColors[blog.status]} px-2 py-0.5`}>
                                        {blog.status}
                                    </Badge>
                                    <Badge className="bg-cyan-500/20 text-cyan-500 px-2 py-0.5">
                                        Featured
                                    </Badge>
                                </div>

                                <h2 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-400">
                                    {blog.title}
                                </h2>

                                <p className="text-gray-300 mb-4 text-lg">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={blog.author.avatar} />
                                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                                {blog.author.username[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm text-cyan-400">{blog.author.username}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(blog.publishedAt)}</span>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <Clock className="h-4 w-4" />
                                        <span>{blog.readTime}</span>
                                    </div>
                                </div>

                                <Button className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white">
                                    Read Full Article <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </div>

                            <div className="md:w-1/3 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 flex items-center justify-center p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Heart className="h-5 w-5 text-pink-500" />
                                        <span>{blog.likes} likes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-5 w-5 text-cyan-500" />
                                        <span>{blog.comments} comments</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-5 w-5 text-blue-500" />
                                        <span>{blog.views} views</span>
                                    </div>
                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                                            <Bookmark className="mr-2 h-4 w-4" /> Save for later
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}

                {/* Regular blog list */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleBlogs.filter(blog => !blog.featured || sampleBlogs.indexOf(blog) !== 0).map(blog => (
                        <Card
                            key={blog.id}
                            className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${blog.featured ? "border-l-4 border-cyan-500" : ""}`}
                        >
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-center mb-2">
                                    <Badge className={`${categoryColors[blog.category]} px-2 py-0.5`}>
                                        {blog.category}
                                    </Badge>
                                    <Badge className={`${statusColors[blog.status]} px-2 py-0.5`}>
                                        {blog.status}
                                    </Badge>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={blog.author.avatar} />
                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xs">
                                            {blog.author.username[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-cyan-400">{blog.author.username}</span>
                                    <span className="text-gray-400 text-xs">•</span>
                                    <span className="text-gray-400 text-xs">{formatDate(blog.publishedAt)}</span>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-2">
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {blog.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-pink-500">
                      <Heart className="h-3 w-3" /> {blog.likes}
                    </span>
                                        <span className="flex items-center gap-1 text-xs text-cyan-500">
                      <MessageCircle className="h-3 w-3" /> {blog.comments}
                    </span>
                                        <span className="flex items-center gap-1 text-xs text-blue-500">
                      <Eye className="h-3 w-3" /> {blog.views}
                    </span>
                                    </div>

                                    <a href={`/blog/${blog.id}`} className="text-white/80 hover:text-white text-sm flex items-center">
                                        Read more <ChevronRight className="h-3 w-3 ml-1" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BlogList;