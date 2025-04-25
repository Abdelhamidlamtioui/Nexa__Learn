"use client";

import { ForumHeader } from "@/components/forum-header";
import { BlogEditor } from "@/components/blog/blog-editor";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function NewBlogPage() {
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!isAuthenticated) {
            toast({
                title: "Authentication Required",
                description: "Please log in to create blog posts",
                variant: "destructive",
            });
            router.push("/login");
        }
    }, [isAuthenticated, router, toast]);

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main>
                <BlogEditor />
            </main>
        </div>
    );
}