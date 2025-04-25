import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Heart,
    MessageCircle,
    Eye,
    Bookmark,
    Share2,
    ThumbsUp,
    Calendar,
    Clock,
    Tag,
    ArrowLeft,
    ChevronRight,
    ChevronLeft
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Sample blog data
const blog = {
    id: "1",
    title: "Getting Started with React Hooks",
    subtitle: "Simplify your components and manage state more effectively",
    content: `
  <h2>Introduction to React Hooks</h2>
  <p>React Hooks are a powerful feature introduced in React 16.8 that allows you to use state and other React features without writing a class. They let you "hook into" React state and lifecycle features from function components.</p>
  
  <p>Hooks solve many problems that React developers faced over the years, including complex components that were hard to reuse and reason about, confusing classes, and more.</p>
  
  <h2>The useState Hook</h2>
  <p>The useState hook lets you add state to function components. Let's look at a simple counter example:</p>
  
  <pre><code>
  import React, { useState } from 'react';

  function Counter() {
    const [count, setCount] = useState(0);
    
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
  </code></pre>
  
  <p>In this example, useState is a hook. We call it inside a function component to add local state to it. React will preserve this state between re-renders.</p>
  
  <h2>The useEffect Hook</h2>
  <p>The useEffect Hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.</p>
  
  <pre><code>
  import React, { useState, useEffect } from 'react';

  function Example() {
    const [count, setCount] = useState(0);

    useEffect(() => {
      document.title = \`You clicked \${count} times\`;
    });
    
    return (
      <div>
        <p>You clicked {count} times</p>
        <button onClick={() => setCount(count + 1)}>
          Click me
        </button>
      </div>
    );
  }
  </code></pre>
  
  <h2>Rules of Hooks</h2>
  <p>Hooks are JavaScript functions, but they impose two additional rules:</p>
  <ul>
    <li>Only call Hooks at the top level. Don't call Hooks inside loops, conditions, or nested functions.</li>
    <li>Only call Hooks from React function components. Don't call Hooks from regular JavaScript functions.</li>
  </ul>
  
  <h2>Creating Custom Hooks</h2>
  <p>Building your own Hooks lets you extract component logic into reusable functions. A custom Hook is a JavaScript function whose name starts with "use" and that may call other Hooks.</p>
  
  <pre><code>
  import { useState, useEffect } from 'react';

  function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
    return width;
  }
  </code></pre>
  
  <h2>Conclusion</h2>
  <p>React Hooks provide a more direct API to the React concepts you already know: props, state, context, refs, and lifecycle. They also offer a new powerful way to compose behavior in your components.</p>
  
  <p>As you get comfortable with Hooks, you might find that they lead to more concise and clearer code, making your React components more readable and easier to maintain.</p>
  `,
    author: {
        id: "a1",
        username: "reactninja",
        avatar: "/avatars/01.png",
        bio: "Frontend developer specializing in React and modern JavaScript frameworks. Passionate about clean code and optimal user experiences."
    },
    category: "Frontend",
    tags: ["React", "JavaScript", "Web Development", "Hooks", "State Management"],
    publishedAt: "2023-12-15T09:30:00Z",
    updatedAt: "2023-12-16T14:22:00Z",
    readTime: "8 min read",
    likes: 128,
    comments: 32,
    views: 3240,
    status: "Published",
    relatedPosts: [
        {
            id: "r1",
            title: "Advanced React Hooks Patterns",
            excerpt: "Take your React hooks knowledge to the next level with these advanced patterns.",
            category: "Frontend",
            publishedAt: "2023-12-01T10:15:00Z"
        },
        {
            id: "r2",
            title: "State Management in React",
            excerpt: "Compare different state management solutions for React applications.",
            category: "Frontend",
            publishedAt: "2023-11-28T15:45:00Z"
        },
        {
            id: "r3",
            title: "Building Custom React Hooks",
            excerpt: "Learn how to create reusable logic with custom React hooks.",
            category: "Frontend",
            publishedAt: "2023-12-10T08:30:00Z"
        }
    ]
};

// Category to color mapping
const categoryColors = {
    "Frontend": "bg-blue-500/20 text-blue-500",
    "Backend": "bg-green-500/20 text-green-500",
    "CSS": "bg-purple-500/20 text-purple-500",
    "DevOps": "bg-orange-500/20 text-orange-500",
    "Mobile": "bg-pink-500/20 text-pink-500",
    "AI": "bg-cyan-500/20 text-cyan-500",
    "UI/UX": "bg-indigo-500/20 text-indigo-500",
    "Database": "bg-yellow-500/20 text-yellow-500"
};

// Status to color mapping
const statusColors = {
    "Published": "bg-green-500/20 text-green-500",
    "Draft": "bg-yellow-500/20 text-yellow-500",
    "Archived": "bg-gray-500/20 text-gray-500",
    "Under Review": "bg-orange-500/20 text-orange-500"
};

// Format the date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Comment component
const Comment = ({ comment }) => (
    <div className="mb-6">
        <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                    {comment.author.username[0].toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.author.username}</span>
                    <span className="text-gray-400 text-xs">{formatDate(comment.date)}</span>
                </div>
                <p className="text-gray-300 mt-1">{comment.content}</p>
                <div className="flex items-center gap-4 mt-2">
                    <button className="text-gray-400 hover:text-cyan-400 text-xs flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3" /> {comment.likes} Likes
                    </button>
                    <button className="text-gray-400 hover:text-cyan-400 text-xs flex items-center gap-1">
                        Reply
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const sampleComments = [
    {
        id: "c1",
        author: {
            username: "jsdev123",
            avatar: "/avatars/02.png"
        },
        content: "Great article! The explanation of useEffect is particularly helpful. I've been struggling with that concept.",
        date: "2023-12-16T10:30:00Z",
        likes: 8
    },
    {
        id: "c2",
        author: {
            username: "webcodeguru",
            avatar: ""
        },
        content: "Have you considered adding examples of the useMemo and useCallback hooks as well? Those are often misunderstood.",
        date: "2023-12-16T14:45:00Z",
        likes: 5
    }
];

export function BlogPost() {
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [commentText, setCommentText] = useState("");

    // Parse HTML content (in a real app, use a proper HTML parser or markdown)
    const createMarkup = (html) => {
        return { __html: html };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Back button */}
                <a href="/blog" className="flex items-center gap-2 text-gray-300 hover:text-white mb-6 inline-block">
                    <ArrowLeft className="h-4 w-4" /> Back to all posts
                </a>

                {/* Blog header */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <Badge className={`${categoryColors[blog.category]} px-2 py-0.5`}>
                            {blog.category}
                        </Badge>
                        <Badge className={`${statusColors[blog.status]} px-2 py-0.5`}>
                            {blog.status}
                        </Badge>
                        {blog.tags.slice(0, 1).map(tag => (
                            <Badge key={tag} variant="outline" className="text-white border-white/20">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-yellow-500 mb-2">
                        {blog.title}
                    </h1>

                    <p className="text-xl text-gray-300 mb-6">{blog.subtitle}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={blog.author.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                    {blog.author.username[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-cyan-400 font-medium">{blog.author.username}</p>
                                <p className="text-xs">Author</p>
                            </div>
                        </div>

                        <Separator orientation="vertical" className="h-8 bg-white/20" />

                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-cyan-400" />
                            <span>Published: {formatDate(blog.publishedAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-cyan-400" />
                            <span>{blog.readTime}</span>
                        </div>

                        <Separator orientation="vertical" className="h-8 bg-white/20" />

                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span>{blog.views.toLocaleString()} views</span>
                        </div>
                    </div>
                </div>

                {/* Blog content */}
                <Card className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none mb-8">
                    <CardContent className="p-6 md:p-8">
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={createMarkup(blog.content)}></div>

                        {/* Tags */}
                        <div className="mt-8 flex flex-wrap gap-2">
                            <Tag className="h-5 w-5 text-gray-400" />
                            {blog.tags.map(tag => (
                                <span key={tag} className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
                            ))}
                        </div>

                        {/* Engagement buttons */}
                        <div className="mt-8 flex justify-between items-center border-t border-b border-white/10 py-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    className={`flex items-center gap-2 ${liked ? 'text-pink-500' : 'text-white'}`}
                                    onClick={() => setLiked(!liked)}
                                >
                                    <Heart className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} />
                                    <span>{liked ? blog.likes + 1 : blog.likes} likes</span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 text-white"
                                    onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                                >
                                    <MessageCircle className="h-5 w-5" />
                                    <span>{blog.comments} comments</span>
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    className={`${bookmarked ? 'text-cyan-500' : 'text-white'}`}
                                    onClick={() => setBookmarked(!bookmarked)}
                                >
                                    <Bookmark className="h-5 w-5" fill={bookmarked ? 'currentColor' : 'none'} />
                                    <span className="sr-only">Bookmark</span>
                                </Button>

                                <Button variant="ghost" className="text-white">
                                    <Share2 className="h-5 w-5" />
                                    <span className="sr-only">Share</span>
                                </Button>
                            </div>
                        </div>

                        {/* Author bio */}
                        <div className="mt-8 bg-gradient-to-br from-blue-900/40 to-blue-800/40 rounded-lg p-6">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={blog.author.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                                        {blog.author.username[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-medium text-cyan-400">{blog.author.username}</h3>
                                    <p className="text-sm text-gray-300">{blog.author.bio}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Comments section */}
                <div id="comments-section" className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Comments ({blog.comments})</h2>

                    {/* Comment form */}
                    <div className="mb-8">
            <textarea
                className="w-full p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border border-white/20 rounded-lg text-white resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Add a comment..."
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
                        <Button className="mt-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white">
                            Post Comment
                        </Button>
                    </div>

                    {/* Comments list */}
                    <div className="space-y-6">
                        {sampleComments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}
                    </div>
                </div>

                {/* Related posts */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {blog.relatedPosts.map((post) => (
                            <Card key={post.id} className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-none hover:shadow-lg transition-all duration-300">
                                <CardContent className="p-4">
                                    <Badge className={`${categoryColors[post.category]} px-2 py-0.5 mb-2`}>
                                        {post.category}
                                    </Badge>
                                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-xs">{formatDate(post.publishedAt)}</span>
                                        <a href={`/blog/${post.id}`} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
                                            Read <ChevronRight className="h-4 w-4 ml-1" />
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Prev/Next navigation */}
                <div className="flex justify-between items-center">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        <ChevronLeft className="h-4 w-4 mr-2" /> Previous Post
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Next Post <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BlogPost;