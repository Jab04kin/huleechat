import {create} from 'zustand'
import {supabase} from '../lib/supabase'
import type {AuthError, User} from '@supabase/supabase-js'

type SocialProvider = 'google' | 'github' | 'discord'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  isLoginModalOpen: boolean
  // Methods
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  loginWithSocial: (provider: SocialProvider) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  resetError: () => void
  openLoginModal: () => void
  closeLoginModal: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isLoginModalOpen: false,

  // Open/close login modal
  openLoginModal: () => set({ isLoginModalOpen: true, error: null }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  // Clear errors
  resetError: () => set({ error: null }),

  // Email/password login
  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      set({
        user: data.user,
        isAuthenticated: true,
        isLoginModalOpen: false // Close modal on success
      })
    } catch (err) {
      set({ error: (err as AuthError).message || 'Login failed' })
    } finally {
      set({ loading: false })
    }
  },

  // Registration
  register: async (email, password, username) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      })
      if (error) throw error
      set({
        user: data.user,
        isAuthenticated: !!data.user
      })
    } catch (err) {
      set({ error: (err as AuthError).message || 'Registration failed' })
    } finally {
      set({ loading: false })
    }
  },

  // Social login
  loginWithSocial: async (provider) => {
    set({ loading: true, error: null })
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err) {
      set({ error: (err as AuthError).message || 'Social login failed' })
    } finally {
      set({ loading: false })
    }
  },

  // Logout
  logout: async () => {
    set({ loading: true })
    try {
      await supabase.auth.signOut()
      set({
        user: null,
        isAuthenticated: false
      })
    } finally {
      set({ loading: false })
    }
  },

  // Check auth state
  checkAuth: async () => {
    set({ loading: true })
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      set({
        user,
        isAuthenticated: !!user,
        loading: false
      })
    } catch (err) {
      set({
        error: (err as AuthError).message || 'Auth check failed',
        loading: false
      })
    }
  }
}))

// Auth state listener
supabase.auth.onAuthStateChange((event, session) => {
  const store = useAuthStore.getState()
  if (event === 'SIGNED_IN' && session?.user) {
    store.checkAuth()
  } else if (event === 'SIGNED_OUT') {
    store.logout()
  }
})