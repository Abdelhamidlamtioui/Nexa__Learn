// api.ts
import axios, { AxiosResponse } from 'axios'
import { axiosInstance } from "@/lib/axios";
import { BlogDTO } from "@/types/blog";

interface LoginCredentials {
  username: string;
  password: string;
}

interface UserData {
  email: string;
  username: string;
  // Add other user fields
}

interface PasswordUpdate {
    currentPassword: string;
    newPassword: string;
}

export interface UserProfile {
  email: string;
  username: string;
  avatar?: string;
}

interface PasswordUpdate {
  currentPassword: string;
  newPassword: string;
}




const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token")
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const refreshToken = localStorage.getItem("refreshToken")
          const response = await api.post<{token: string}>("/users/refresh", { refreshToken })
          localStorage.setItem("token", response.data.token)
          originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`
          return api(originalRequest)
        } catch {
          window.location.href = "/login"
        }
      }
      return Promise.reject(error)
    }
)

const authService = {
  login: (credentials: LoginCredentials): Promise<AxiosResponse<any>> => api.post("/users/login", credentials),
  register: (userData: UserData): Promise<AxiosResponse<any>> => api.post("/users/register", userData),
  logout: (): Promise<AxiosResponse<any>> => api.post("/auth/logout"),
  getCurrentUser: (): Promise<AxiosResponse<any>> => api.get('/users/me'),
  updateProfile: (userData: UserProfile): Promise<AxiosResponse<any>> => api.put("/users/me", userData),
  updatePassword: (passwordData: PasswordUpdate) => 
    api.put('/users/me/password', passwordData),
}

const userService = {
  getProfile: () => api.get("/users/me"),
  updateProfile: (userData: UserData) => api.put("/users/me", userData),
  uploadAvatar: (formData: FormData) => api.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  updatePassword: (passwordData: PasswordUpdate) =>
        api.put("/users/me/password", passwordData),
}

const forumService = {
  getPosts: () => api.get("/forum/posts"),
  getPostById: (id: string) => api.get(`/forum/posts/${id}`),
  createPost: (postData: any) => api.post("/forum/posts", postData),
  updatePost: (id: string, postData: any) => api.put(`/forum/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/forum/posts/${id}`)
}

const blogService = {
  
  getAllBlogs: (page = 0, size = 10, sort = "createdAt,desc") => 
    api.get(`/blogs?page=${page}&size=${size}&sort=${sort}`),
  
  getPublishedBlogs: (page = 0, size = 10, sort = "createdAt,desc") => 
    api.get(`/blogs/published?page=${page}&size=${size}&sort=${sort}`),
  
  getTrendingBlogs: (page = 0, size = 10) => 
    api.get(`/blogs/popular?page=${page}&size=${size}`),
    
  getLatestBlogs: (page = 0, size = 10) => 
    api.get(`/blogs?page=${page}&size=${size}&sort=createdAt,desc`),
  
  createBlog: (blogData: {
    title: string;
    content: string;
    tags?: string[];
    pointsCost?: number;
  }) => api.post("/blogs", blogData),
  
  getBlogById: (id: string) => api.get(`/blogs/${id}`),
  
  async likeBlog(blogId: string): Promise<BlogDTO> {
    const response = await axiosInstance.post(`/blogs/${blogId}/like`);
    return response.data.data;
  },
  
  async unlikeBlog(blogId: string): Promise<BlogDTO> {
    const response = await axiosInstance.post(`/blogs/${blogId}/unlike`);
    return response.data.data;
  },

  getComments: (blogId: string, page = 0, size = 10) =>
    api.get(`/blogs/${blogId}/comments?page=${page}&size=${size}`),
    
  createComment: (blogId: string, data: { content: string }) =>
    api.post(`/blogs/${blogId}/comments`, data),
    
  updateComment: (blogId: string, commentId: string, data: { content: string }) =>
    api.put(`/blogs/${blogId}/comments/${commentId}`, data),
    
  deleteComment: (blogId: string, commentId: string) =>
    api.delete(`/blogs/${blogId}/comments/${commentId}`),
}

export { blogService }

export { authService, userService, forumService }
export default api