"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog } from "@headlessui/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { blogService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { X, Loader2 } from "lucide-react"
import { CommentList } from "./comment-list"
import { BlogCommentDTO } from "@/app/types/comment"
import { cn } from "@/lib/utils"

interface CommentModalProps {
  blogId: string
  onClose: () => void
  onCommentAdded?: () => void
}

export function CommentModal({ blogId, onClose, onCommentAdded }: CommentModalProps) {
  const [comments, setComments] = useState<BlogCommentDTO[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await blogService.createComment(blogId, { content: newComment })
      
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Comment added successfully"
        })
        setNewComment("")
        fetchComments(true)
        onCommentAdded?.()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="relative z-50"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-lg"
          >
            <Dialog.Panel className="w-full bg-gradient-to-br from-gray-900 to-purple-900 rounded-lg shadow-xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title className="text-xl font-semibold text-white">
                    Comments
                  </Dialog.Title>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="max-h-[60vh] overflow-y-auto pr-2">
                    <CommentList
                      comments={comments}
                      loading={loading}
                      hasMore={hasMore}
                      onLoadMore={() => fetchComments()}
                    />
                  </div>

                  <form onSubmit={handleSubmit} className="pt-4 border-t border-white/20">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className={cn(
                        "bg-white/10 border-white/20 text-white mb-3",
                        "focus:bg-white/20 focus:border-white/30",
                        "placeholder:text-gray-400"
                      )}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          "Post Comment"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </Dialog.Panel>
          </motion.div>
        </div>
      </div>
    </Dialog>
  )
} 