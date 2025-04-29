import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { blogService } from "@/services/api";
import { useAuthStore } from "@/stores/useAuthStore";

export function MyDraftsList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [drafts, setDrafts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await blogService.getBlogsByAuthor(user.id, 0, 20);
        if (response.data && response.data.success) {
          // Filter for DRAFT status
          const draftsOnly = response.data.data.content.filter((blog: any) => blog.status === "DRAFT");
          setDrafts(draftsOnly);
        } else {
          setError("Failed to fetch drafts");
        }
      } catch (e) {
        setError("Failed to fetch drafts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDrafts();
  }, [user]);

  if (!user?.id) return null;

  return (
    <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg mb-8">
      <CardHeader>
        <CardTitle className="text-white text-2xl">My Drafts</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-gray-300">Loading drafts...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : drafts.length === 0 ? (
          <div className="text-gray-400">You have no drafts.</div>
        ) : (
          <ul className="divide-y divide-gray-600">
            {drafts.map((draft) => (
              <li key={draft.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-white">{draft.title || <em>(Untitled)</em>}</span>
                  <span className="ml-3 text-xs text-yellow-400 bg-yellow-900 rounded px-2 py-0.5">Draft</span>
                  <div className="text-xs text-gray-400 mt-1">Last updated: {new Date(draft.lastUpdatedAt || draft.createdAt).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => router.push(`/dev-forum/blog/edit/${draft.id}`)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={async () => {
                    if (!window.confirm('Are you sure you want to delete this draft?')) return;
                    try {
                      await blogService.deleteBlog(draft.id);
                      setDrafts(prev => prev.filter(d => d.id !== draft.id));
                    } catch (e) {
                      alert('Failed to delete draft.');
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
