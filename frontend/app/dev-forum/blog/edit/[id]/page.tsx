"use client";

import { ForumHeader } from "@/components/forum-header";
import { BlogEditor } from "@/components/blog/blog-editor";

export default function EditBlogPage({ params }) {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <ForumHeader />
            <main>
                <BlogEditor blogId={params.id} />
            </main>
        </div>
    );
}