// types/blog.ts
export interface BlogDTO {
    id: string;
    title: string;
    content: string;
    authorId: string;
    author?: string;
    tags: string[];
    likes: number;
    hasLiked?: boolean;
    comments: number;
    createdAt: string;
    category?: string;
    codeSnippet?: string;
    published: boolean;
    publishedAt?: string;
}