// blogService.ts
import axios from 'axios';
import api, { getAuthHeader } from './api';
import { toast } from '@/components/ui/use-toast';

export interface BlogDTO {
    id?: string;
    title: string;
    content: string;
    authorId?: string;
    authorUsername?: string;
    authorAvatarUrl?: string;
    tags?: string[];
    likes?: number;
    pointsCost?: number;
    published?: boolean;
    publishedAt?: string;
    createdAt?: string;
    lastUpdatedAt?: string;
    hasLiked?: boolean;
}

const blogService = {
    // Get all blogs with pagination
    getAllBlogs: async (page = 0, size = 10, sortBy = "createdAt", sortDir = "desc") => {
        try {
            return await api.get(`/blogs?page=${page}&size=${size}&sort=${sortBy},${sortDir}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch blogs');
            throw error;
        }
    },

    // Get published blogs
    getPublishedBlogs: async (page = 0, size = 10) => {
        try {
            return await api.get(`/blogs/published?page=${page}&size=${size}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch published blogs');
            throw error;
        }
    },

    // Get a specific blog by ID
    getBlogById: async (id: string) => {
        try {
            return await api.get(`/blogs/${id}`, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch blog');
            throw error;
        }
    },

    // Create a new blog
    createBlog: async (blogData: BlogDTO) => {
        try {
            return await api.post('/blogs', blogData, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to create blog');
            throw error;
        }
    },

    // Update an existing blog
    updateBlog: async (id: string, blogData: BlogDTO) => {
        try {
            return await api.put(`/blogs/${id}`, blogData, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to update blog');
            throw error;
        }
    },

    // Delete a blog
    deleteBlog: async (id: string) => {
        try {
            return await api.delete(`/blogs/${id}`, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to delete blog');
            throw error;
        }
    },

    // Publish a blog
    publishBlog: async (id: string) => {
        try {
            return await api.post(`/blogs/${id}/publish`, {}, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to publish blog');
            throw error;
        }
    },

    // Toggle like on a blog
    toggleLike: async (blogId: string) => {
        try {
            return await api.post(`/blogs/${blogId}/toggle-like`, {}, { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to toggle like status');
            throw error;
        }
    },

    // Get blogs by author
    getBlogsByAuthor: async (authorId: string, page = 0, size = 10) => {
        try {
            return await api.get(`/blogs/author/${authorId}?page=${page}&size=${size}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch author blogs');
            throw error;
        }
    },

    // Get blogs by tag
    getBlogsByTag: async (tag: string, page = 0, size = 10) => {
        try {
            return await api.get(`/blogs/tag/${tag}?page=${page}&size=${size}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch blogs by tag');
            throw error;
        }
    },

    // Search blogs
    searchBlogs: async (query: string, page = 0, size = 10) => {
        try {
            return await api.get(`/blogs/search?query=${encodeURIComponent(query)}&page=${page}&size=${size}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to search blogs');
            throw error;
        }
    },

    // Get popular blogs
    getPopularBlogs: async (page = 0, size = 10) => {
        try {
            return await api.get(`/blogs/popular?page=${page}&size=${size}`,
                { headers: getAuthHeader() });
        } catch (error) {
            handleBlogError(error, 'Failed to fetch popular blogs');
            throw error;
        }
    }
};

// Helper function to handle blog-specific errors
function handleBlogError(error: any, defaultMessage: string) {
    console.error(`Blog service error: ${defaultMessage}`, error);

    // Check if the error is an Axios error with a response
    if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const responseMessage = error.response.data?.message || defaultMessage;

        // Handle specific HTTP status codes
        if (status === 401 || status === 403) {
            toast({
                title: "Authentication Error",
                description: "Please log in to access blog content.",
                variant: "destructive",
            });
        } else if (status === 404) {
            toast({
                title: "Blog Not Found",
                description: "The requested blog post could not be found.",
                variant: "destructive",
            });
        } else {
            toast({
                title: "Error",
                description: responseMessage,
                variant: "destructive",
            });
        }
    } else {
        // Generic error handling
        toast({
            title: "Error",
            description: defaultMessage,
            variant: "destructive",
        });
    }
}

export { blogService };