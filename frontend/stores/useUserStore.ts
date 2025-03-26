import { create } from 'zustand'
import { userService } from '@/services/api'

interface Statistics {
  totalActiveUsers: number
  newUsersToday: number
  totalStudents: number
  totalInstructors: number
  avgEngagement: number
}

interface Filters {
  roles?: string[];
  registrationDate?: string | null;
  minPoints?: number;
  maxPoints?: number;
  enabled?: boolean;
  activityLevel?: string | null;
}

interface Role {
  name: string;
  id: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  roles: Role[];
  enabled: boolean;
  avatar?: string;
  points: number;
  lastLogin?: string;
  createdAt: string;
}

interface UserState {
  users: User[]
  statistics: Statistics | null
  currentPage: number
  totalPages: number
  totalElements: number
  loading: boolean
  error: string | null
  filters: Filters
  sortBy: string
  sortDirection: 'ASC' | 'DESC'
  fetchUsers: () => Promise<void>
  fetchStatistics: () => Promise<void>
  addUser: (userData: any) => Promise<void>
  updateUser: (userId: string, userData: Partial<User>) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  updateUserStatus: (userId: string, enabled: boolean) => Promise<void>
  setCurrentPage: (page: number) => void
  setFilters: (filters: Filters) => void
  setSorting: (column: string, direction: 'ASC' | 'DESC') => void
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  statistics: null,
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  error: null,
  filters: {
    roles: [],
    registrationDate: null,
    minPoints: 0,
    maxPoints: 5000,
    enabled: true,
    activityLevel: null
  },
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  setSorting: (column, direction) => {
    set({ sortBy: column, sortDirection: direction })
    get().fetchUsers()
  },

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null });
      const { currentPage, filters } = get();
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: '10'
      });

      if (filters.roles?.length) {
        filters.roles.forEach(role => params.append('roles', role));
      }
      if (filters.registrationDate) {
        params.append('registrationDate', filters.registrationDate);
      }
      if (filters.minPoints !== undefined) {
        params.append('minPoints', filters.minPoints.toString());
      }
      if (filters.maxPoints !== undefined) {
        params.append('maxPoints', filters.maxPoints.toString());
      }
      if (filters.enabled !== undefined) {
        params.append('enabled', filters.enabled.toString());
      }
      if (filters.activityLevel) {
        params.append('activityLevel', filters.activityLevel);
      }

      const response = await userService.getFilteredUsers(params);
      set({ 
        users: response.data.data.content,
        totalPages: response.data.data.totalPages,
        totalElements: response.data.data.totalElements,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        loading: false 
      });
    }
  },

  fetchStatistics: async () => {
    try {
      const response = await userService.getUserStatistics()
      set({ statistics: response.data.data })
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  },

  addUser: async (userData) => {
    try {
      await userService.register(userData)
      // Refresh both users and statistics
      await get().fetchUsers()
      await get().fetchStatistics()
    } catch (error) {
      throw error
    }
  },

  updateUser: async (userId, userData) => {
    try {
      // @ts-ignore
      await userService.updateUser(userId, userData)
      await get().fetchUsers()
      await get().fetchStatistics()
    } catch (error) {
      throw error
    }
  },

  deleteUser: async (userId) => {
    try {
      await userService.deleteUser(userId)
      await get().fetchUsers()
      await get().fetchStatistics()
    } catch (error) {
      throw error
    }
  },

  updateUserStatus: async (userId, enabled) => {
    try {
      await userService.updateUserStatus(userId, enabled)
      await get().fetchUsers()
      await get().fetchStatistics()
    } catch (error) {
      throw error
    }
  },

  setCurrentPage: (page) => {
    set({ currentPage: page })
  },

  setFilters: (filters) => set({ filters }),

  updateUserRoles: async (userId: string, roles: string[]) => {
    try {
      // Filter out any invalid roles
      const validRoles = roles.filter(role => role && role.trim().length > 0);
      
      if (validRoles.length === 0) {
        throw new Error('At least one valid role must be selected');
      }

      await userService.updateUserRoles(userId, validRoles);
      const { users } = get();
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { ...user, roles: validRoles.map(role => ({ name: role, id: role })) }
          : user
      );
      set({ users: updatedUsers });
    } catch (error) {
      console.error('Failed to update user roles:', error);
      throw error;
    }
  }
})) 