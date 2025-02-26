"use client"

import { useState, useEffect } from 'react'
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"

const samplePosts = [
  {
    id: 1,
    title: "Mastering React Hooks",
    author: "HookMaster",
    content: "React Hooks have revolutionized the way we write React components. In this post, we'll dive deep into advanced patterns with useState, useEffect, and custom hooks. We'll explore real-world scenarios where hooks shine and discuss best practices for managing complex state and side effects.",
    category: "Frontend",
    votes: 42,
    comments: 15,
    codeSnippet: `const [state, setState] = useState(initialState);
useEffect(() => {
  // Side effect code here
  return () => {
    // Cleanup code here
  };
}, [dependency]);`,
  },
  {
    id: 2,
    title: "GraphQL vs REST: The Ultimate Showdown",
    author: "APIGuru",
    content: "In the world of API design, GraphQL and REST are two popular approaches. This post compares their strengths, weaknesses, and use cases. We'll discuss performance considerations, ease of use for frontend developers, and scalability. By the end, you'll have a clear understanding of when to choose GraphQL or REST for your next project.",
    category: "Backend",
    votes: 38,
    comments: 23,
    codeSnippet: `query {
  user(id: "1") {
    name
    email
    posts {
      title
    }
  }
}`,
  },
  {
    id: 3,
    title: "Optimizing Docker Containers for Production",
    author: "DockerPro",
    content: "Docker has become an essential tool in modern development workflows. This post focuses on advanced techniques for optimizing Docker containers for production environments. We'll cover multi-stage builds, minimizing image sizes, security best practices, and performance tuning. Learn how to create efficient, secure, and scalable containerized applications.",
    category: "DevOps",
    votes: 31,
    comments: 9,
    codeSnippet: `FROM node:14-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 3000
CMD ["npm", "start"]`,
  },
]

export function PostList() {
  const [posts, setPosts] = useState(samplePosts)

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>
      {posts.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button variant="outline" className="text-white border-white hover:bg-white hover:text-purple-900 transition-colors duration-300">
            Load More Discussions
          </Button>
        </div>
      )}
    </div>
  )
}

