"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminGuard } from "@/components/guards/AdminGuard";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryManager } from "@/components/blog/category-manager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ForumHeader } from "@/components/forum-header";

export default function BlogCategoriesPage() {
  const router = useRouter();
  
  return (
    <AdminGuard>
      <ForumHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center mb-8">
            
            <div>
              <h1 className="text-3xl font-bold mb-1 text-white">Blog Categories</h1>
              <p className="text-gray-300">
                Manage blog categories for better organization
              </p>
            </div>
          </div>

          {/* Admin actions nav */}
          <div className="mb-6 flex overflow-x-auto pb-2">
            <div className="flex space-x-2">
              <Link href="/dev-forum/admin/dashboard">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/dev-forum/admin/blog-management">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap"
                >
                  Blog Management
                </Button>
              </Link>
              <Link href="/dev-forum/admin/blog-categories">
                <Button 
                  variant="outline" 
                  className="border-white/20 text-white whitespace-nowrap bg-white/10"
                >
                  Blog Categories
                </Button>
              </Link>
            </div>
          </div>

          <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none">
            <CardContent className="p-6">
              <CategoryManager />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
}
