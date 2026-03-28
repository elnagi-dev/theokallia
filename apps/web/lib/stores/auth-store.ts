import { create } from 'zustand'
import type {AuthUser } from '@theokallia/types'

interface AuthState {
  // The currently logged-in user — null if not logged in
  user: AuthUser | null
  // Whether we're still checking if a session exists on app load
  isLoading: boolean
  // Whether the user is logged in
  isAuthenticated: boolean
  redirectTo: string | null
  // Actions
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  setRedirectTo: (path: string | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  redirectTo: null,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setRedirectTo: (path) => set({ redirectTo: path }),
}))