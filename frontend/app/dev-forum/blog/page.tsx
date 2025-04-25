"use client";

import { ForumHeader } from "@/components/forum-header";
import { BlogList } from "@/components/blog/blog-list";

export default function BlogPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main>
                <BlogList />
            </main>
        </div>
    );
}