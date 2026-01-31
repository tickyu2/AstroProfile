import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

interface User {
  id: string
  email: string
  displayName: string
  role: 'admin' | 'editor' | 'reviewer' | 'translator'
}

interface AuthState {
  token: string | null
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await api.post('/auth/login', { email, password })
          const { token, user } = response.data

          api.defaults.headers.common['Authorization'] = `Bearer ${token}`

          set({
            token,
            user,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.response?.data?.error || 'Login failed'
          })
          throw error
        }
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization']
        set({
          token: null,
          user: null,
          isAuthenticated: false
        })
      },

      refreshToken: async () => {
        const { token } = get()
        if (!token) return

        try {
          const response = await api.post('/auth/refresh')
          const newToken = response.data.token

          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
          set({ token: newToken })
        } catch (error) {
          get().logout()
        }
      }
    }),
    {
      name: 'genesis-admin-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`
        }
      }
    }
  )
)
