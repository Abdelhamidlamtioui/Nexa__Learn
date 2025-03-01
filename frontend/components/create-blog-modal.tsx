// components/blog/create-blog-modal.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog } from "@headlessui/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { blogService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateBlogModalProps {
  open: boolean
  onClose: () => void
}

export function CreateBlogModal({ open, onClose }: CreateBlogModalProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await blogService.createBlog({
        title,
        content,
        tags: tags.split(",").map(tag => tag.trim()),
        pointsCost: 0
      })

      if (response.data.success) {
        toast({
          title: "Success",
          description: "Blog post created successfully!",
        })
        
        // Reset form and close modal
        setTitle("")
        setContent("")
        setTags("")
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          static
          open={open}
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
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-2xl overflow-hidden rounded-lg"
              >
                <Dialog.Panel className="w-full bg-gradient-to-br from-gray-900 to-purple-900 rounded-lg shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Dialog.Title className="text-xl font-semibold text-white">
                        Create New Blog Post
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

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-white">Title</Label>
                        <Input
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className={cn(
                            "bg-white/10 border-white/20 text-white",
                            "focus:bg-white/20 focus:border-white/30",
                            "placeholder:text-gray-400"
                          )}
                          placeholder="Enter your blog title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="content" className="text-white">Content</Label>
                        <Textarea
                          id="content"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          required
                          className={cn(
                            "bg-white/10 border-white/20 text-white min-h-[200px]",
                            "focus:bg-white/20 focus:border-white/30",
                            "placeholder:text-gray-400"
                          )}
                          placeholder="Write your blog content here..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags" className="text-white">Tags</Label>
                        <Input
                          id="tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          className={cn(
                            "bg-white/10 border-white/20 text-white",
                            "focus:bg-white/20 focus:border-white/30",
                            "placeholder:text-gray-400"
                          )}
                          placeholder="tech, programming, web development"
                        />
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                          className="text-white border-white/20 hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={submitting}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                        >
                          {submitting ? "Creating..." : "Create Post"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}