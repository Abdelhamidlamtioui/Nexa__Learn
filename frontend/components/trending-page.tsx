import { ForumHeader } from "@/components/forum-header"
import { TrendingPostList } from "@/components/trending-post-list"
import { TrendingFilter } from "@/components/trending-filter"
import { SearchBar } from "@/components/search-bar"
import { CreatePostButton } from "@/components/create-post-button"

export function TrendingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ForumHeader />
      <main className="flex-grow container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500">
            Trending Discussions
          </h1>
          <div className="flex items-center space-x-4">
            <SearchBar />
            <CreatePostButton />
          </div>
        </div>
        <TrendingFilter />
        <TrendingPostList />
      </main>
    </div>
  )
}

