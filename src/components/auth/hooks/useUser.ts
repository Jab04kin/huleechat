import {useEffect, useState} from 'react'
import {supabase} from '../../../lib/supabase'
import type {User} from '@supabase/supabase-js' // Убрали Session

interface Profile {
  id: string
  username?: string
  avatar_url?: string
  bio?: string
  updated_at?: string
}

export default function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError) throw authError

        if (user) {
          setUser(user)

          const { data, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (!profileError) {
            setProfile(data)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(fetchUserData)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({ ...updates, id: user.id })

      if (!error) {
        setProfile(prev => ({ ...prev, ...updates } as Profile))
      }

      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Update failed' }
    }
  }

  return { user, profile, updateProfile, loading, error }
}