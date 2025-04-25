"use client";

import { ForumHeader } from "@/components/forum-header";
import { BlogEditor } from "@/components/blog/blog-editor";
import { useEffect, useState } from "react";

export default function EditBlogPage({ params }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, you would fetch the blog post data by ID (params.id)
        // and pass it to the BlogEditor component
        setIsLoading(false);
    }, [params.id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main>
                <BlogEditor />
            </main>
        </div>
    );
}