import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { authService } from '@/services/api'

export interface User {
  id: string
  username: string
  email: string
  roles: Array<string | { name: string }>
  avatar?: string
  createdAt?: string
  points?: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  initialized: boolean
  error: string | null
  fetchUser: () => Promise<void>
  login: (credentials: { username: string; password: string }) => Promise<void>
  logout: () => void
  checkIsAdmin: () => boolean
  updateAvatar: (avatarUrl: string) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: false,
        error: null,
        fetchUser: async () => {
          if (get().loading) return;
          
          set({ loading: true, error: null })
          try {
            const token = document.cookie
              .split('; ')
              .find(row => row.startsWith('token='))
              ?.split('=')[1];
              
            if (!token) {
              set({ 
                user: null, 
                isAuthenticated: false, 
                loading: false,
                initialized: true
              })
              return
            }
              
            const response = await authService.getCurrentUser()
            
            console.log("Fetched user data:", response.data.data)
            
            if (response.data.success) {
              const userData = response.data.data
              
              let standardizedRoles = userData.roles || []
              if (!Array.isArray(standardizedRoles)) {
                standardizedRoles = [standardizedRoles]
              }
              
              const user = {
                ...userData,
                roles: standardizedRoles
              }
              
              set({ 
                user,
                isAuthenticated: true, 
                loading: false,
                initialized: true
              })
            } else {
              set({ 
                user: null, 
                isAuthenticated: false, 
                loading: false,
                initialized: true
              })
            }
          } catch (error) {
            console.error('Error fetching user:', error)
            set({ 
              user: null, 
              isAuthenticated: false, 
              loading: false,
              initialized: true,
              error: 'Failed to fetch user data' 
            })
          }
        },
        login: async (credentials) => {
          set({ loading: true, error: null })
          try {
            const response = await authService.login(credentials)
            
            if (response.data.success) {
              const userData = response.data.data.user
              
              let standardizedRoles = userData.roles || []
              if (!Array.isArray(standardizedRoles)) {
                standardizedRoles = [standardizedRoles]
              }
              
              set({ 
                user: {
                  ...userData,
                  roles: standardizedRoles
                }, 
                isAuthenticated: true,
                loading: false,
                initialized: true
              })
            } else {
              set({ 
                error: 'Invalid credentials', 
                loading: false,
                initialized: true
              })
            }
          } catch (error: any) {
            console.error('Login error:', error)
            set({ 
              error: error.response?.data?.message || 'Login failed', 
              loading: false,
              initialized: true
            })
            throw error
          }
        },
        logout: () => {
          authService.logout()
          set({ 
            user: null, 
            isAuthenticated: false 
          })
        },
        checkIsAdmin: () => {
          const { user } = get()
          if (!user || !user.roles) return false
          
          return user.roles.some((role: any) => {
            if (typeof role === 'string') {
              return role === 'ADMIN' || role === 'ROLE_ADMIN'
            } else if (role && typeof role === 'object') {
              return role.name === 'ADMIN' || role.name === 'ROLE_ADMIN'
            }
            return false
          })
        },
        updateAvatar: (avatarUrl: string) => {
          const { user } = get();
          if (user) {
            set({ 
              user: { 
                ...user, 
                avatar: avatarUrl 
              } 
            });
          }
        }
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({ 
          user: state.user, 
          isAuthenticated: state.isAuthenticated,
          initialized: state.initialized 
        }),
      }
    )
  )
) 