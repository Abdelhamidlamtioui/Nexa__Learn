import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";

export function MyPublishedList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [published, setPublished] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublished = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await blogService.getBlogsByAuthor(user.id, 0, 20);
        if (response.data && response.data.success) {
          // Filter for PUBLISHED status
          const publishedOnly = response.data.data.content.filter((blog: any) => blog.status === "PUBLISHED");
          setPublished(publishedOnly);
        } else {
          setError("Failed to fetch published posts");
        }
      } catch (e) {
        setError("Failed to fetch published posts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublished();
  }, [user]);

  if (!user?.id) return null;

  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg mb-8">
      <CardHeader>
        <CardTitle className="text-white text-2xl">My Published Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-300">Loading published posts...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : published.length === 0 ? (
          <div className="text-gray-400">You have no published posts.</div>
        ) : (
          <ul className="divide-y divide-gray-600">
            {published.map((post) => (
              <li key={post.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-white">{post.title || <em>(Untitled)</em>}</span>
                  <span className="ml-3 text-xs text-green-400 bg-green-900 rounded px-2 py-0.5">Published</span>
                  <div className="text-xs text-gray-400 mt-1">Published: {new Date(post.publishedAt || post.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => router.push(`/dev-forum/blog/${post.id}`)}>
                    View
                  </Button>
                  <Button size="sm" variant="destructive" onClick={async () => {
                    if (!window.confirm('Are you sure you want to delete this published post?')) return;
                    try {
                      await blogService.deleteBlog(post.id);
                      setPublished(prev => prev.filter(p => p.id !== post.id));
                    } catch (e) {
                      alert('Failed to delete published post.');
                    }
                  }}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
