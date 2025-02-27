// components/comments/comment-form.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function CommentForm({ onSubmit, disabled }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      await onSubmit(content)
      setContent("")
      toast({
        title: "Success",
        description: "Comment posted successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder-gray-400
                   focus:border-purple-500 focus:ring-purple-500 transition-colors"
        disabled={submitting || disabled}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={submitting || disabled}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 
                     hover:to-purple-700 text-white transition-all duration-200"
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Posting...
            </div>
          ) : (
            "Post Comment"
          )}
        </Button>
      </div>
    </motion.form>
  )
}