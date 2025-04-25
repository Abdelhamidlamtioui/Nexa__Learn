// api.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import { User } from '@/app/types/user'
import { DocumentationDTO } from '@/app/types/documentation';

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

// Fix potential duplication of /api in URLs
// Remove trailing slash if present to ensure consistent URL joining
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api").replace(/\/$/, '')

// Create logger for debugging
const logRequest = (method: string, url: string, data?: any) => {
  console.log(`API ${method}:`, url, data || '')
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add failure count for circuit breaker
let authFailureCount = 0;
const MAX_AUTH_FAILURES = 3;
const authFailureReset = () => { authFailureCount = 0; };

// Reset auth failure count periodically
if (typeof window !== 'undefined') {
  setInterval(authFailureReset, 60000); // Reset every minute
}

// Add response logger for debugging
api.interceptors.response.use(
  response => {
    // Successful response - reset auth failure counter
    authFailureCount = 0;
    return response;
  },
    async (error) => {
    // Skip token refresh for logout and other flagged requests
    if (error.config && error.config.__skipAuthRefresh) {
      console.log('Skipping auth refresh for this request as flagged:', error.config.url);
      return Promise.reject(error);
    }
    
    // Circuit breaker to prevent infinite loops
    if (authFailureCount >= MAX_AUTH_FAILURES) {
      console.error(`Too many authentication failures (${authFailureCount}), forcing logout`);
      // Use a direct approach to logout that won't trigger another API call
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=too_many_failures';
      }
      return Promise.reject(error);
    }
    
    // Check if error is due to an expired token (both 401 and 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403) && 
        error.config && !error.config.__isRetryRequest) {
      console.log(`Received ${error.response.status} error, attempting to refresh token...`, {
        url: error.config.url,
        method: error.config.method,
        errorData: error.response.data
      });
      
      try {
        // Prevent multiple refresh attempts
        if (!isRefreshing) {
          isRefreshing = true;
          authFailureCount++; // Increment failure counter
          
          const refreshResult = await authService.refreshToken();
          isRefreshing = false;
          
          if (refreshResult.success) {
            console.log('Token refreshed successfully, retrying request');
            authFailureCount = 0; // Reset on success
            
            // Get the new token
            const newToken = localStorage.getItem('token') || '';
            
            // Update the Authorization header for the failed request
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            error.config.__isRetryRequest = true;
            
            // Notify subscribers that token has been refreshed
            onTokenRefreshed(newToken);
            
            // Retry the original request with the new token
            return axios(error.config);
          } else {
            console.error('Failed to refresh token:', refreshResult.reason);
            // Use a modified logout that won't trigger API call
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            
            if (typeof window !== 'undefined') {
              window.location.href = '/login?error=refresh_failed';
            }
          }
        } else {
          // If already refreshing, wait for the new token
          return new Promise((resolve, reject) => {
            subscribeTokenRefresh((newToken) => {
              error.config.headers['Authorization'] = `Bearer ${newToken}`;
              error.config.__isRetryRequest = true;
              resolve(axios(error.config));
            });
          });
        }
      } catch (refreshError) {
        isRefreshing = false;
        authFailureCount++; // Increment failure counter
        console.error('Error during token refresh:', refreshError);
        
        return Promise.reject(error);
      }
    }
    
    console.error('API Error:', 
      error.config?.url, 
      error.response?.status, 
      error.response?.data || error.message
    );
      return Promise.reject(error);
    }
)

// Helper function to get auth header for requests
const getAuthHeader = () => {
  // Try to get token from localStorage first
  let token = localStorage.getItem('token');
  
  // If not in localStorage, check cookies
  if (!token) {
    const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
      
    if (cookieToken) {
      token = cookieToken;
    }
  }
  
  return token ? { "Authorization": `Bearer ${token}` } : {};
};

const authService = {
  login: async (credentials: LoginCredentials) => {
    logRequest('POST', '/users/login', credentials)
    console.log('Attempting login to:', `${API_BASE_URL}/users/login`);
    
    try {
      const response = await api.post("/users/login", credentials);
      
      // Debug the response
      console.log('Login response received:', {
        status: response.status,
        hasToken: !!response.data.data.token,
        hasRefreshToken: !!response.data.data.refreshToken,
        responseData: response.data
      });
      
    // Set cookies with proper attributes
      if (response.data.data.token) {
        document.cookie = `token=${response.data.data.token}; path=/; sameSite=lax${location.protocol === 'https:' ? '; secure' : ''}`;
        console.log('Access token cookie set');
        
        // Also store in localStorage
        localStorage.setItem('token', response.data.data.token);
        console.log('Access token stored in localStorage');
      } else {
        console.error('No access token in response');
      }
      
      if (response.data.data.refreshToken) {
        document.cookie = `refreshToken=${response.data.data.refreshToken}; path=/; sameSite=lax${location.protocol === 'https:' ? '; secure' : ''}`;
        console.log('Refresh token cookie set');
        
        // Also store in localStorage
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        console.log('Refresh token stored in localStorage');
      } else {
        console.error('No refresh token in response');
      }
      
      // Check if cookies were actually set
      setTimeout(() => {
        const cookies = document.cookie.split(';').map(c => c.trim());
        console.log('Current cookies after login:', cookies);
        console.log('Has token cookie:', cookies.some(c => c.startsWith('token=')));
        console.log('Has refreshToken cookie:', cookies.some(c => c.startsWith('refreshToken=')));
        
        // Check localStorage
        console.log('LocalStorage tokens:', {
          token: !!localStorage.getItem('token'),
          refreshToken: !!localStorage.getItem('refreshToken')
        });
        
        // Start token refresh monitor
        if (typeof window !== 'undefined' && !!localStorage.getItem('token')) {
          console.log('[Token Monitor] Starting token refresh monitor after login');
          //window.setupTokenRefresh();
        }
      }, 100);
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Login error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
          config: {
            url: error.config?.url,
            baseURL: error.config?.baseURL,
            method: error.config?.method
          }
        });
      }
      throw error;
    }
  },
  register: (userData: UserData): Promise<AxiosResponse<any>> => api.post("/users/register", userData),
  logout: async () => {
    try {
      // Skip the interceptor for this specific logout request
      await axios({
        method: 'post',
        url: `${API_BASE_URL}/auth/logout`,
        headers: getAuthHeader(),
        // Add a flag to skip token refresh for this request
        __skipAuthRefresh: true
      });
    } catch (error) {
      // Silently handle errors during logout - we're logging out anyway
      console.warn('Logout API call failed, but continuing with local logout:', error);
    } finally {
      // Always clear local tokens regardless of API success/failure
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      console.log('Tokens cleared from cookies and localStorage');
      
      // Clear any refresh intervals
      if (typeof window !== 'undefined' && window.tokenRefreshIntervalId) {
        clearInterval(window.tokenRefreshIntervalId);
        window.tokenRefreshIntervalId = undefined;
        console.log('Token refresh monitor stopped');
      }
    }
  },
  getCurrentUser: (): Promise<AxiosResponse<any>> => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.get('/users/me', {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  updateProfile: (userData: UserProfile): Promise<AxiosResponse<any>> => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.put("/users/me", userData, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  updatePassword: (passwordData: PasswordUpdate) => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    
    return api.put('/users/me/password', passwordData, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    });
  },
  refreshToken: async () => {
    try {
      // Try to get refresh token from localStorage first, then cookies
      let refreshToken = localStorage.getItem('refreshToken');
      
      // If not in localStorage, check cookies
      if (!refreshToken) {
        const cookies = document.cookie.split('; ');
        console.log('All cookies before refresh attempt:', cookies);
        
        const cookieRefreshToken = cookies
        .find(row => row.startsWith('refreshToken='))
        ?.split('=')[1];

        if (cookieRefreshToken) {
          refreshToken = cookieRefreshToken;
        }
      }

      console.log('Found refresh token?', !!refreshToken);

      if (!refreshToken) {
        console.error('No refresh token found in localStorage or cookies');
        return { success: false, reason: 'no_refresh_token' };
      }

      const response = await api.post("/users/refresh", { refreshToken });
      console.log('Refresh token response:', {
        status: response.status,
        hasNewToken: !!response.data.data.token,
        hasNewRefreshToken: !!response.data.data.refreshToken
      });
      
      // Update cookies and localStorage with new tokens
      if (response.data.data.token) {
      document.cookie = `token=${response.data.data.token}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
        localStorage.setItem('token', response.data.data.token);
      }
      
      if (response.data.data.refreshToken) {
      document.cookie = `refreshToken=${response.data.data.refreshToken}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      
      // Verify storage
      setTimeout(() => {
        const updatedCookies = document.cookie.split(';').map(c => c.trim());
        console.log('Cookies after refresh:', updatedCookies);
        console.log('LocalStorage after refresh:', {
          token: !!localStorage.getItem('token'),
          refreshToken: !!localStorage.getItem('refreshToken')
        });
      }, 100);
      
      return { success: true, token: response.data.data.token };
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Clear invalid tokens from both storage mechanisms
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return { success: false, reason: 'refresh_failed', error };
    }
  }
}

const userService = {
  getProfile: () => api.get("/users/me", { headers: getAuthHeader() }),
  updateProfile: (userData: UserData) => api.put("/users/me", userData, { headers: getAuthHeader() }),
  uploadAvatar: (formData: FormData) => api.post("/upload/avatar", formData, {
    headers: { 
      "Content-Type": "multipart/form-data",
      ...getAuthHeader()
    }
  }),
  updatePassword: (passwordData: PasswordUpdate) =>
        api.put("/users/me/password", passwordData, { headers: getAuthHeader() }),
  getUsers: (page = 0, size = 10) => 
    api.get(`/users?page=${page}&size=${size}`, { headers: getAuthHeader() }),
  getUser: (id: string) => 
    api.get(`/users/${id}`, { headers: getAuthHeader() }),
  updateUser: (id: string, userData: Partial<User>) => 
    api.put(`/users/${id}`, userData, { headers: getAuthHeader() }),
  deleteUser: (id: string) => 
    api.delete(`/users/${id}`, { headers: getAuthHeader() }),
  addPoints: (id: string, points: number, description?: string) => 
    api.post(`/users/${id}/points/add`, { points, description }, { headers: getAuthHeader() }),
  getTopUsers: (limit = 10) => 
    api.get(`/users/stats/top?limit=${limit}`, { headers: getAuthHeader() }),
  getUserStatistics: () => 
    api.get('/users/statistics', { headers: getAuthHeader() }),
  getUserDetails: (userId: string) => 
    api.get(`/users/${userId}`, { headers: getAuthHeader() }),
  updateUserStatus: (userId: string, enabled: boolean) => 
    api.patch(`/users/${userId}/status`, { enabled }, { headers: getAuthHeader() }),
  register: (userData: { username: string; email: string; password: string; role: string }) =>
    api.post("/users/register", userData),
  getFilteredUsers: (params: URLSearchParams) => 
    api.get(`/users/filter?${params.toString()}`, { headers: getAuthHeader() }),
  updateUserRoles: (userId: string, roles: string[]) => 
    api.put(`/users/${userId}/roles`, { roles }, { headers: getAuthHeader() }),
}

// Helper function for debugging tokens - accessible from browser console
const checkTokens = () => {
  // Check cookies
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  const refreshTokenCookie = cookies.find(c => c.startsWith('refreshToken='));
  
  // Check localStorage
  const tokenLS = localStorage.getItem('token');
  const refreshTokenLS = localStorage.getItem('refreshToken');
  
  console.log('Current auth state:');
  console.log('COOKIES:');
  console.log('- Has access token in cookies:', !!tokenCookie);
  console.log('- Has refresh token in cookies:', !!refreshTokenCookie);
  
  console.log('LOCAL STORAGE:');
  console.log('- Has access token in localStorage:', !!tokenLS);
  console.log('- Has refresh token in localStorage:', !!refreshTokenLS);
  
  // Show truncated tokens from cookies
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    console.log('- Cookie Token (truncated):', 
      token.substring(0, 10) + '...' + token.substring(token.length - 10));
  }
  
  if (refreshTokenCookie) {
    const refreshToken = refreshTokenCookie.split('=')[1];
    console.log('- Cookie Refresh Token (truncated):', 
      refreshToken.substring(0, 10) + '...' + refreshToken.substring(refreshToken.length - 10));
  }
  
  // Show truncated tokens from localStorage
  if (tokenLS) {
    console.log('- LocalStorage Token (truncated):', 
      tokenLS.substring(0, 10) + '...' + tokenLS.substring(tokenLS.length - 10));
  }
  
  if (refreshTokenLS) {
    console.log('- LocalStorage Refresh Token (truncated):', 
      refreshTokenLS.substring(0, 10) + '...' + refreshTokenLS.substring(refreshTokenLS.length - 10));
  }
  
  return { 
    cookies: {
      hasToken: !!tokenCookie,
      hasRefreshToken: !!refreshTokenCookie
    },
    localStorage: {
      hasToken: !!tokenLS,
      hasRefreshToken: !!refreshTokenLS
    }
  };
};

// Make it globally available
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.checkAuthTokens = checkTokens;
  
  // Add token status checker
  // @ts-ignore
  window.checkTokenStatus = () => {
    const token = localStorage.getItem('token') || 
      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
    
    if (!token) {
      console.log('No token found');
      return { hasToken: false };
    }
    
    const decoded = decodeToken(token);
    if (!decoded) {
      console.log('Token could not be decoded');
      return { hasToken: true, isValid: false };
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    const expiresIn = decoded.exp - currentTime;
    const isExpired = expiresIn <= 0;
    
    console.log(`Token status:`);
    console.log(`- Expires at: ${new Date(decoded.exp * 1000).toLocaleTimeString()}`);
    console.log(`- Current time: ${new Date().toLocaleTimeString()}`);
    console.log(`- Expires in: ${expiresIn} seconds (${Math.floor(expiresIn / 60)} minutes)`);
    console.log(`- Is expired: ${isExpired}`);
    
    return {
      hasToken: true,
      isValid: !isExpired,
      expiresIn,
      expiry: new Date(decoded.exp * 1000).toLocaleTimeString(),
      payload: decoded
    };
  };
  
  // Set up proactive token refresh
  const setupTokenRefresh = () => {
    // Clear any existing interval first
    if (window.tokenRefreshIntervalId) {
      clearInterval(window.tokenRefreshIntervalId);
      window.tokenRefreshIntervalId = undefined;
    }

    const CHECK_INTERVAL = 15000; // Check every 15 seconds
    const REFRESH_THRESHOLD = 30; // Refresh when less than 30 seconds until expiry
    
    const checkAndRefreshToken = async () => {
      const token = localStorage.getItem('token') || 
        document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null;
      
      if (!token) return;
      
      const decoded = decodeToken(token);
      if (!decoded) return;
      
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = decoded.exp - currentTime;
      
      console.log(`[Token Monitor] Token expires in ${expiresIn} seconds (${Math.round(expiresIn/60)} minutes)`);
      
      // If token will expire soon, refresh it
      if (expiresIn < REFRESH_THRESHOLD && expiresIn > 0) {
        console.log(`[Token Monitor] Token expiring soon (${expiresIn}s remaining), refreshing...`);
        try {
          if (!isRefreshing) {
            isRefreshing = true;
            const result = await authService.refreshToken();
            isRefreshing = false;
            
            if (result.success) {
              console.log(`[Token Monitor] Token refreshed successfully`);
              // Decode and show new expiration time
              const newToken = localStorage.getItem('token');
              if (newToken) {
                const newDecoded = decodeToken(newToken);
                if (newDecoded) {
                  const newExpiresIn = newDecoded.exp - Math.floor(Date.now() / 1000);
                  console.log(`[Token Monitor] New token expires in ${newExpiresIn} seconds (${Math.round(newExpiresIn/60)} minutes)`);
                }
              }
            } else {
              console.error(`[Token Monitor] Token refresh failed: ${result.reason}`);
            }
          } else {
            console.log(`[Token Monitor] Refresh already in progress, skipping`);
          }
        } catch (error) {
          isRefreshing = false;
          console.error(`[Token Monitor] Error refreshing token:`, error);
        }
      }
    };
    
    // Initial check
    checkAndRefreshToken();
    
    // Set up interval for regular checks
    const intervalId = setInterval(checkAndRefreshToken, CHECK_INTERVAL);
    
    // Store interval ID in window object for later cleanup
    window.tokenRefreshIntervalId = intervalId;
    
    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
      if (window.tokenRefreshIntervalId) {
        clearInterval(window.tokenRefreshIntervalId);
        window.tokenRefreshIntervalId = undefined;
      }
    });
    
    return () => {
      if (window.tokenRefreshIntervalId) {
        clearInterval(window.tokenRefreshIntervalId);
        window.tokenRefreshIntervalId = undefined;
      }
    };
  };
  
  // Start token monitor when page loads
  document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token') || 
      document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
      
    if (token) {
      console.log('[Token Monitor] Starting token refresh monitor');
      setupTokenRefresh();
    }
  });
}

const documentationService = {
  // Get all documentation (folders)
  getAllDocumentation: (page = 0, size = 20) =>
      api.get(`/documentation?page=${page}&size=${size}` , { headers: getAuthHeader() }),

  // Get a specific documentation with its sections
  getDocumentation: (id: string) =>
      api.get(`/documentation/${id}` , { headers: getAuthHeader() }),

  // Create new documentation (folder)
  createDocumentation: (data: {
    title: string;
    content: string;
    technology: string;
    tags?: string[];
  }) => api.post('/documentation', data, { headers: getAuthHeader() }),

  // Update documentation
  updateDocumentation: (docId: string, data: Partial<DocumentationDTO>) =>
      api.put(`/documentation/${docId}`, data, { headers: getAuthHeader() }),

  // Create new section (document)
  createSection: (docId: string, data: {
    title: string;
    content: string;
    sectionId?: string;
    orderIndex?: number;
  }) => api.post(`/documentation/${docId}/sections`, data, { headers: getAuthHeader() }),

  // get a specific section
    getSection: (sectionId: string) =>
        api.get(`/documentation/sections/${sectionId}` , { headers: getAuthHeader() }),

  // Get document structure
  getDocumentStructure: (docId: string) =>
      api.get(`/documentation/${docId}/structure` , { headers: getAuthHeader() }),

  // Create documentation from template
  createFromTemplate: (templateType: string, customizations: { title: string; description: string }) => 
      api.post(`/documentation/templates/${templateType}`, customizations, { headers: getAuthHeader() }),

  // Get documentation analytics/statistics
  getDocumentationStats: () =>
      api.get('/documentation/stats', { headers: getAuthHeader() }),
      
  // Get recent activity
  getRecentActivity: () =>
      api.get('/moderator/documentation/recent-activity', { headers: getAuthHeader() }),
      
  // Get document details including sections, workflow, analytics
  getDocumentDetails: (docId: string) =>
      api.get(`/moderator/documentation/document-details/${docId}`, { headers: getAuthHeader() }),
      
  // Get moderation dashboard
  getModerationDashboard: () =>
      api.get('/moderator/documentation/dashboard', { headers: getAuthHeader() }),
      
  // Get workflow statistics
  getWorkflowStats: () =>
      api.get('/documentation/workflow/stats', { headers: getAuthHeader() }),
      
  // Update document status
    updateStatus: (docId: string, status: string, comment?: string) => {
    const data: { status: string; comment?: string } = { status };
    if (comment) data.comment = comment;
    
    return api.put(`/documentation/${docId}/status`, data, { headers: getAuthHeader() });
  },

  // Update an existing section
  updateSection: (sectionId: string, data: Partial<{
    title: string;
    content: string;
    sectionId: string;
    orderIndex: number;
  }>) => api.put(`/documentation/sections/${sectionId}`, data, { headers: getAuthHeader() }),

  // Get documentation by technology type
  getDocumentationByTechnology: (technology: string, page = 0, size = 20) =>
    api.get(`/documentation/technology/${technology}?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Get documentation by tag
  getDocumentationByTag: (tag: string, page = 0, size = 20) =>
    api.get(`/documentation/tag/${tag}?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Get documentation by author
  getDocumentationByAuthor: (authorId: string, page = 0, size = 20) =>
    api.get(`/documentation/author/${authorId}?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Get most viewed documentation
  getMostViewedDocumentation: (page = 0, size = 20) =>
    api.get(`/documentation/popular?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Search documentation
  searchDocumentation: (query: string, page = 0, size = 20) =>
    api.get(`/documentation/search?query=${query}&page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Search sections
  searchSections: (query: string, page = 0, size = 20) =>
    api.get(`/documentation/sections/search?query=${query}&page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Increment views
  incrementViews: (docId: string) =>
    api.post(`/documentation/${docId}/views`, {}, { headers: getAuthHeader() }),

  // Delete documentation
  deleteDocumentation: (docId: string) =>
    api.delete(`/documentation/${docId}`, { headers: getAuthHeader() }),

  // Delete section
  deleteSection:  (sectionId : string ) =>
    api.delete(`/documentation/sections/${sectionId}` , { headers: getAuthHeader() }),

  // Get documentation sections
  getDocumentationSections: (docId: string) =>
    api.get(`/documentation/${docId}/sections`, { headers: getAuthHeader() }),

  // Get documentation reading time
  getDocumentationReadingTime: (docId: string) =>
    api.get(`/documentation/${docId}/reading-time`, { headers: getAuthHeader() }),

  // Get documentation status distribution
  getDocumentStatusDistribution: () =>
    api.get('/documentation/stats/status-distribution', { headers: getAuthHeader() }),

  // Get documentation technology distribution
  getDocumentTechnologyDistribution: () =>
    api.get('/documentation/stats/technology-distribution', { headers: getAuthHeader() }),

  // Get documentation by status
  getDocumentationByStatus: (status: string, page = 0, size = 20) =>
    api.get(`/documentation/status/${status}?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Reorder sections
  reorderSections: (docId: string, orderedSections: Array<{ id: string }>) =>
    api.put(`/documentation/${docId}/structure/reorder`, orderedSections, { headers: getAuthHeader() }),

  // Count by status
  countByStatus: (status: string) =>
    api.get(`/documentation/count/${status}`, { headers: getAuthHeader() }),

  // Get documentation statistics summary
  getStatisticsSummary: () =>
    api.get('/moderator/documentation/statistics/summary', { headers: getAuthHeader() }),

  // Get documentation queue
  getModeratorQueue: (page = 0, size = 10) =>
    api.get(`/moderator/documentation/queue?page=${page}&size=${size}`, { headers: getAuthHeader() }),

  // Submit review
  submitReview: (docId: string, reviewData: { approved: boolean, feedback: string }) =>
    api.post(`/moderator/documentation/${docId}/review`, reviewData, { headers: getAuthHeader() }),

  // Get moderator analytics
  getModeratorAnalytics: () =>
    api.get('/moderator/documentation/analytics', { headers: getAuthHeader() }),
}

// Add JWT token interface
interface JwtPayload {
  sub: string;
  iat: number;
  exp: number;
}

// Function to decode JWT token
const decodeToken = (token: string): JwtPayload | null => {
  try {
    // JWT tokens have 3 parts separated by dots
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    // Convert base64url to base64
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode and parse JSON
    const payload = JSON.parse(atob(base64));
    return payload as JwtPayload;
  } catch (e) {
    console.error('Error decoding token:', e);
    return null;
  }
};

// Function to check if token is expired or about to expire (within 30 seconds)
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded) return true;
  
  // Get current time in seconds and add 30 seconds buffer
  const currentTime = Math.floor(Date.now() / 1000) + 30;
  return decoded.exp < currentTime;
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
// Store pending requests
let refreshSubscribers: Array<(token: string) => void> = [];

// Subscribe a callback to be invoked when token refresh completes
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// Notify all subscribers that token refresh is complete with new token
const onTokenRefreshed = (newToken: string) => {
  refreshSubscribers.forEach(cb => cb(newToken));
  refreshSubscribers = [];
};

// Add request interceptor to check token expiration
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip token check for login and refresh endpoints
    const isAuthEndpoint = 
      config.url === '/users/login' || 
      config.url === '/users/register' || 
      config.url === '/users/refresh';
      
    if (isAuthEndpoint) {
      return config;
    }
    
    // Get token from localStorage
    let token = localStorage.getItem('token');
    
    // If not in localStorage, check cookies
    if (!token) {
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
        
      if (cookieToken) {
        token = cookieToken;
      }
    }
    
    // If we have a token and it's expired or about to expire
    if (token && isTokenExpired(token)) {
      // If already refreshing, wait for the new token
      if (isRefreshing) {
        return new Promise<InternalAxiosRequestConfig>((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            // Replace old token with new token
            if (config.headers) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(config);
          });
        });
      }
      
      isRefreshing = true;
      
      try {
        console.log('Token expired or about to expire, refreshing...');
        // Call refresh token endpoint
        const refreshResult = await authService.refreshToken();
        isRefreshing = false;
        
        if (refreshResult.success) {
          // Get the new token
          const newToken = localStorage.getItem('token') || '';
          
          // Notify subscribers
          onTokenRefreshed(newToken);
          
          // Set the Authorization header for current request
          if (config.headers) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        }
      } catch (error) {
        isRefreshing = false;
        console.error('Failed to refresh token:', error);
        // Clear tokens and redirect to login
        authService.logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add request interceptor for debugging auth headers
api.interceptors.request.use(
  config => {
    const hasAuthHeader = !!config.headers?.Authorization;
    const isAuthEndpoint = 
      config.url === '/users/login' || 
      config.url === '/users/register' || 
      config.url === '/users/refresh' ||
      config.url === '/auth/logout';
      
    // Only log non-auth endpoints
    if (!isAuthEndpoint) {
      console.log(`[Request] ${config.method?.toUpperCase()} ${config.url} - Auth header: ${hasAuthHeader ? "Present" : "Missing"}`);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add TypeScript declarations for window properties
declare global {
  interface Window {
    checkAuthTokens: () => any;
    checkTokenStatus: () => any;
    setupTokenRefresh: () => () => void;
    tokenRefreshIntervalId?: NodeJS.Timeout;
  }
}

// Extend AxiosRequestConfig to include our custom properties
declare module 'axios' {
  export interface AxiosRequestConfig {
    __skipAuthRefresh?: boolean;
    __isRetryRequest?: boolean;
  }
}

export { authService, userService , documentationService, checkTokens }
export default api
