"use client";

import { useState } from "react";
import { ForumHeader } from "@/components/forum-header";
import { BlogList } from "@/components/blog/blog-list";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function BlogPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();

    const handleCreateBlog = () => {
        if (isAuthenticated) {
            router.push("/dev-forum/blog/new");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500">
                        Developer Blog
                    </h1>
                    <Button
                        onClick={handleCreateBlog}
                        className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Create New Post
                    </Button>
                </div>
                <BlogList />
            </main>
        </div>
    );
}