// components/comments/comment-section.tsx
"use client"

import { useState, useEffect } from "react"

import { blogService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";
import { BlogCommentDTO } from "@/app/types/comment";

interface CommentSectionProps {
  blogId: string;
  onCommentAdded?: () => void;
}

export function CommentSection({ blogId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<BlogCommentDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()

  const fetchComments = async (resetPage = false) => {
    try {
      setLoading(true)
      const currentPage = resetPage ? 0 : page
      const response = await blogService.getComments(blogId, currentPage)

      if (response.data.success) {
        const newComments = response.data.data.content
        setComments(prev => resetPage ? newComments : [...prev, ...newComments])
        setPage(prev => resetPage ? 1 : prev + 1)
        setHasMore(newComments.length > 0)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments(true)
  }, [blogId])

  const handleCommentSubmit = async (content: string) => {
    try {
      const response = await blogService.createComment(blogId, { content })
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Comment added successfully"
        })
        fetchComments(true)
        onCommentAdded?.()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6">
      <CommentForm onSubmit={handleCommentSubmit} />
      <CommentList 
        comments={comments}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={() => fetchComments()}
      />
    </div>
  )
}
