// components/comments/comment-list.tsx
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Loader2, ThumbsUp, ThumbsDown, MoreVertical } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BlogCommentDTO } from "@/app/types/comment"

interface CommentListProps {
  comments: BlogCommentDTO[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onDelete?: (commentId: string) => void;
  onEdit?: (commentId: string) => void;
  currentUserId?: string;
}

export function CommentList({ 
  comments, 
  loading, 
  hasMore, 
  onLoadMore,
  onDelete,
  onEdit,
  currentUserId 
}: CommentListProps) {
  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white/5 p-4 rounded-lg shadow-lg backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.authorUsername[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-medium text-purple-400">
                    {comment.authorUsername}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {currentUserId === comment.authorId && (onDelete || onEdit) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                    {onEdit && (
                      <DropdownMenuItem
                        onClick={() => onEdit(comment.id)}
                        className="text-white hover:bg-gray-800"
                      >
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(comment.id)}
                        className="text-red-400 hover:bg-gray-800"
                      >
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {comment.content}
            </p>

            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/10">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span className="text-xs">12</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="text-white border-white/20 hover:bg-white/10"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading more comments...
              </div>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </motion.div>
      )}

      {!loading && comments.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-gray-400"
        >
          No comments yet. Be the first to comment!
        </motion.div>
      )}
    </div>
  )
}