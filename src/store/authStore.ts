// store/authStore.ts
import { create } from 'zustand'

interface User {
  id: string
  name: string
  token: string
}

interface AuthState {
  user: User | null
  login: (token: string, userInfo: Omit<User, 'token'>) => void
  logout: () => void
  isLogin: boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  login: (token, userInfo) => {
    set({ user: { ...userInfo, token } })
    localStorage.setItem('token', token) // 持久化存储
  },
  logout: () => {
    set({ user: null })
    localStorage.removeItem('token')
  },
  get isLogin() {
    return !!get().user?.token
  }
}))
