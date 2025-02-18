export function useAuth() {
    // Get user from localStorage or other state management
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

    return {
        user,
        isAuthenticated: !!user
    };
} 