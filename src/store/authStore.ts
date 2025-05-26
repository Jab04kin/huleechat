import {create} from 'zustand';
import {supabase} from '../lib/supabase';
import type {AuthError, User} from '@supabase/supabase-js';

type SocialProvider = 'google' | 'github' | 'discord';

interface Profile {
  username?: string;
  avatar_url?: string;
  full_name?: string;
  updated_at?: string;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isLoginModalOpen: boolean;
  authModalType: 'login' | 'register';
  availableProviders: SocialProvider[];
  reset: () => void;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  loginWithSocial: (provider: SocialProvider) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  createProfile: (user: User) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  fetchProviders: () => Promise<void>;
  resetError: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  setAuthModalType: (type: 'login' | 'register') => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isLoginModalOpen: false,
  authModalType: 'login',
  availableProviders: [],

  // UI Methods
  // Open/close login modal

  // Clear errors
  reset: () => set({ error: null }),

  openLoginModal: () => set({ isLoginModalOpen: true, error: null }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  setAuthModalType: (type) => set({ authModalType: type }),
  resetError: () => set({ error: null }),

  // Auth Methods
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      set({
        user: data.user,
        isAuthenticated: true,
        isLoginModalOpen: false,
        loading: false
      });

      await get().fetchProfile();
    } catch (error) {
      set({
        error: (error as AuthError).message || 'Login failed',
        loading: false
      });
    }
  },

  register: async (email, password, username) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } }
      });
      if (error) throw error;

      set({
        user: data.user,
        isAuthenticated: true,
        loading: false
      });

      if (data.user) {
        await get().createProfile(data.user);
      }
    } catch (error) {
      set({
        error: (error as AuthError).message || 'Registration failed',
        loading: false
      });
    }
  },

  loginWithSocial: async (provider) => {
    try {
      set({ loading: true, error: null });

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          scopes: provider === 'github' ? 'repo,user' : undefined
        }
      });
      if (error) throw error;
    } catch (error) {
      const err = error as AuthError;
      set({
        error: err.message.includes('provider is not enabled')
          ? 'This login method is not configured. Please contact administrator.'
          : err.message,
        loading: false
      });
    }
  },

  logout: async () => {
    try {
      set({ loading: true });

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      set({
        user: null,
        profile: null,
        isAuthenticated: false,
        loading: false
      });
    } catch (error) {
      set({
        error: (error as AuthError).message || 'Logout failed',
        loading: false
      });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true, error: null });

      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;

      set({
        user: session?.user ?? null,
        isAuthenticated: !!session?.user,
        loading: false
      });

      if (session?.user) {
        await get().fetchProfile();
      }
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        error: (error as AuthError).message || 'Auth check failed'
      });
    }
  },

  // Profile Methods
  fetchProfile: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, full_name, updated_at')
        .eq('id', user.id)
        .single();

      if (error?.code === 'PGRST116') {
        await get().createProfile(user);
        return;
      }
      if (error) throw error;

      set({ profile });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      set({
        error: 'Failed to load profile',
        loading: false
      });
    }
  },

  createProfile: async (user) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: user.email?.split('@')[0],
          avatar_url: null,
          full_name: '',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      await get().fetchProfile();
    } catch (error) {
      console.error('Failed to create profile:', error);
      set({
        error: 'Failed to create profile',
        loading: false
      });
    }
  },

  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ loading: true });

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      set((state) => ({
        profile: { ...state.profile, ...updates } as Profile,
        loading: false
      }));
    } catch (error) {
      console.error('Failed to update profile:', error);
      set({
        loading: false,
        error: 'Failed to update profile'
      });
    }
  },

  uploadAvatar: async (file) => {
    const { user } = get();
    if (!user) return;

    try {
      set({ loading: true });

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await get().updateProfile({ avatar_url: publicUrl });
    } catch (error) {
      console.error('Failed to upload avatar:', error);
      set({
        loading: false,
        error: 'Failed to upload avatar'
      });
    }
  },

  fetchProviders: async () => {
    try {
      const providers: SocialProvider[] = ['google', 'github', 'discord'];
      set({ availableProviders: providers });
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  }
}));

// Initialize auth state and providers
const initializeAuth = async () => {
  await useAuthStore.getState().checkAuth();
  await useAuthStore.getState().fetchProviders();
};

// Set up auth state listener
supabase.auth.onAuthStateChange((event) => {
  const store = useAuthStore.getState();
  if (event === 'SIGNED_IN') {
    store.checkAuth().catch(console.error);
  } else if (event === 'SIGNED_OUT') {
    store.logout().catch(console.error);
  }
});

// Initial setup
initializeAuth().catch(console.error);