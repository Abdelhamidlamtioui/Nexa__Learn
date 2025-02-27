import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function PostDetail({ postId }: { postId: string }) {
  // In a real application, you would fetch the post data based on the postId
  const post = {
    id: postId,
    title: "Check out this cool React component I built!",
    author: "ReactEnthusiast",
    content: "I've been working on a new React component that simplifies state management. Here's a screenshot of it in action. What do you think? Any suggestions for improvement?",
    upvotes: 42,
    downvotes: 5,
    createdAt: "2023-07-15T10:30:00Z",
    imageUrl: "/placeholder.svg?height=400&width=600"
  }

  const voteCount = post.upvotes - post.downvotes

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarFallback>{post.author[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">Posted by {post.author}</span>
          <span className="text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="mb-4">{post.content}</p>
        {post.imageUrl && (
          <div className="mb-4">
            <img src={post.imageUrl || "/placeholder.svg"} alt="Post image" className="w-full h-auto rounded-md" />
          </div>
        )}
        {post.videoUrl && (
          <div className="mb-4">
            <video src={post.videoUrl} controls className="w-full h-auto rounded-md">
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <ArrowBigUp className="mr-1 h-4 w-4" />
            <span className="text-sm font-medium">{voteCount}</span>
            <ArrowBigDown className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

