"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ForumHeader } from "@/components/forum-header";
import { BlogPost } from "@/components/blog/blog-post";
import { blogService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export default function BlogPostPage({ params }) {
    const router = useRouter();
    const { toast } = useToast();
    const [blog, setBlog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            if (!params.id) {
                router.push("/dev-forum/blog");
                return;
            }

            try {
                setIsLoading(true);
                const response = await blogService.getBlogById(params.id);
                if (response.data && response.data.success) {
                    setBlog(response.data.data);
                } else {
                    setError("Failed to load blog post");
                    toast({
                        title: "Error",
                        description: "Failed to load blog post",
                        variant: "destructive",
                    });
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
                setError("Failed to load blog post");
                toast({
                    title: "Error",
                    description: error.response?.data?.message || "Failed to load blog post",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [params.id, router, toast]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <ForumHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-white text-xl">Loading blog post...</div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <ForumHeader />
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-white text-xl">
                        {error || "Blog post not found"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main>
                <BlogPost blog={blog} />
            </main>
        </div>
    );
}