export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  roles: string[]
  points: number
  level: number
  createdAt: string
  lastLogin?: string
  enabled: boolean
} 