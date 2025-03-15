"use client"

import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function CreatePostButton() {
  return (
    <Button className="rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white hover:from-pink-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl">
      <Plus className="mr-2 h-4 w-4" /> Create Post
    </Button>
  )
}

