"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/api";
import { Heart, ChevronRight } from "lucide-react";

export function LikedBlogsList() {
    const [blogs, setBlogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const router = useRouter();
    const pageSize = 6;

    useEffect(() => {
        fetchLikedBlogs(0, true);
        // eslint-disable-next-line
    }, []);

    const fetchLikedBlogs = async (pageNumber = 0, reset = false) => {
        setIsLoading(true);
        try {
            const response = await blogService.getLikedBlogs(pageNumber, pageSize);
            if (response.data && response.data.success) {
                const data = response.data.data;
                if (reset) {
                    setBlogs(data.content);
                } else {
                    setBlogs(prev => [...prev, ...data.content]);
                }
                setHasMore(!data.last);
                setTotalPages(data.totalPages);
                setPage(data.number);
            }
        } catch (error) {
            // Optionally handle error
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!hasMore) return;
        fetchLikedBlogs(page + 1);
    };

    const handleNavigate = (id) => {
        router.push(`/dev-forum/blog/${id}`);
    };

    if (isLoading && blogs.length === 0) {
        return <div className="text-gray-300">Loading liked blogs...</div>;
    }

    if (!isLoading && blogs.length === 0) {
        return <div className="text-gray-300">You haven't liked any blogs yet.</div>;
    }

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Liked Blogs</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogs.map(blog => (
                    <Card key={blog.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg cursor-pointer hover:scale-[1.01] transition-transform duration-200" onClick={() => handleNavigate(blog.id)}>
                        <CardHeader>
                            <h3 className="text-lg font-semibold mb-1 text-white line-clamp-1">{blog.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="flex items-center gap-1 text-pink-500">
                                    <Heart className="h-3 w-3" /> {blog.likes || 0}
                                </span>
                                <span>{blog.authorUsername}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-2">
                            <p className="text-gray-200 text-sm mb-2 line-clamp-2">{blog.content}</p>
                            <span className="text-cyan-400 hover:text-cyan-200 text-xs flex items-center">
                                Read more <ChevronRight className="h-3 w-3 ml-1" />
                            </span>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Load more button */}
            {!isLoading && blogs.length > 0 && hasMore && (
                <div className="flex justify-center mt-8">
                    <Button
                        onClick={handleLoadMore}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
                    >
                        {isLoading ? "Loading..." : "Load More"}
                    </Button>
                </div>
            )}
        </div>
    );
}
