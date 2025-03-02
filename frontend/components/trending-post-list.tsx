// components/trending-post-list.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { debounce } from 'lodash'
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { blogService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { CreateBlogModal } from "@/components/create-blog-modal"
import { CommentSection } from "@/components/comment-section"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, PlusIcon, Search, X } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { BlogDTO } from "@/app/types/blog"
import { BlogCommentDTO } from "@/app/types/comment"
import { CommentModal } from "@/components/comment-modal"



type SortOption = "trending" | "latest" | "most-commented";

interface ExtendedBlogDTO extends BlogDTO {
  showComments?: boolean;
  commentCount?: number;
}

export function TrendingPostList() {
  const [posts, setPosts] = useState<ExtendedBlogDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>("trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchPosts = async (resetPage = false) => {
    try {
      setLoading(true)
      const currentPage = resetPage ? 0 : page
      let response;

      if (searchQuery) {
        response = await blogService.searchBlogs(searchQuery, currentPage)
      } else {
        switch (sortBy) {
          case "trending":
            response = await blogService.getTrendingBlogs(currentPage)
            break
          case "latest":
            response = await blogService.getLatestBlogs(currentPage)
            break
          case "most-commented":
            response = await blogService.getAllBlogs(currentPage, 10, "comments.size,desc")
            break
          default:
            response = await blogService.getTrendingBlogs(currentPage)
        }
      }

      if (response.data.success) {
        const newPosts = response.data.data.content.map(post => ({
          ...post,
          showComments: post.id === selectedPost,
          commentCount: post.comments?.length || 0
        }))
        setPosts(prev => resetPage ? newPosts : [...prev, ...newPosts])
        setPage(prev => resetPage ? 1 : prev + 1)
        setHasMore(newPosts.length > 0)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Error loading posts",
        description: "Failed to load posts. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query !== searchQuery) {
        setSearchQuery(query)
        fetchPosts(true)
      }
    }, 500),
    []
  )

  useEffect(() => {
    fetchPosts(true)
  }, [sortBy])

  const handleSortChange = (value: SortOption) => {
    setSortBy(value)
    setPage(0)
    setPosts([])
  }

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setPage(0)
      setPosts([])
      fetchPosts(true)
    } else {
      debouncedSearch(value)
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateModal(false)
    fetchPosts(true)
    toast({
      title: "Success",
      description: "Your post has been created successfully!",
    })
  }

  const handleLikePost = async (postId: string) => {
    try {
      await blogService.likeBlog(postId)
      fetchPosts(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like the post. Please try again.",
        variant: "destructive"
      })
    }
  }

  const toggleComments = (postId: string) => {
    setSelectedPost(prevId => prevId === postId ? null : postId)
  }

  const handleCommentAdded = async (postId: string) => {
    try {
      const response = await blogService.getBlogById(postId)
      if (response.data.success) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                commentCount: (post.commentCount || 0) + 1,
                comments: response.data.data.comments 
              }
            : post
        ))
      }
    } catch (error) {
      console.error("Error updating comment count:", error)
    }
  }

  return (
    <div className="space-y-8">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 p-6 rounded-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Community Discussions</h2>
          <p className="text-gray-300">Join the conversation on the hottest tech topics</p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-full shadow-lg transform transition-all hover:scale-105"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Create New Post
        </Button>
      </motion.div>

      <motion.div 
        className="flex flex-wrap gap-4 items-center bg-white/5 p-4 rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg">
            <SelectItem 
              value="trending" 
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              Trending
            </SelectItem>
            <SelectItem 
              value="latest" 
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              Latest
            </SelectItem>
            <SelectItem 
              value="most-commented" 
              className="text-white hover:bg-white/10 focus:bg-white/10"
            >
              Most Commented
            </SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 flex gap-2 relative">
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => handleSearch("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex flex-col gap-4"
              >
                <PostCard 
                  {...post}
                  votes={post.likes}
                  author={post.authorUsername}
                  comments={post.commentCount || 0}
                  onLike={() => handleLikePost(post.id)}
                  onComment={() => toggleComments(post.id)}
                />
                
                <AnimatePresence>
                  {post.showComments && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white/5 p-4 rounded-lg"
                    >
                      <CommentSection 
                        blogId={post.id}
                        onCommentAdded={() => handleCommentAdded(post.id)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        ) : !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-gray-400"
          >
            No posts found. {searchQuery ? "Try a different search term." : "Be the first to post!"}
          </motion.div>
        )}
      </AnimatePresence>

      {hasMore && (
        <motion.div
          className="mt-8 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white hover:text-purple-900 transition-colors duration-300 min-w-[200px]"
            onClick={() => fetchPosts()}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : (
              "Load More Discussions"
            )}
          </Button>
          <p className="text-gray-400 text-sm">
            Showing {posts.length} discussions
          </p>
        </motion.div>
      )}

      <CreateBlogModal 
        open={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {selectedPost && (
        <CommentModal 
          blogId={selectedPost}
          onClose={() => setSelectedPost(null)}
          onCommentAdded={() => handleCommentAdded(selectedPost)}
        />
      )}
    </div>
  )
}