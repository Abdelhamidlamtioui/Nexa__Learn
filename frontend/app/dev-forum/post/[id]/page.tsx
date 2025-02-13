import { ForumHeader } from "@/components/forum-header"
import { PostDetail } from "@/components/post-detail"
import { CommentSection } from "@/components/comment-section"

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <ForumHeader />
      <main className="container mx-auto py-6">
        <PostDetail postId={params.id} />
        <CommentSection postId={params.id} />
      </main>
    </div>
  )
}

