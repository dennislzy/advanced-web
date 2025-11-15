// hooks/useAuth.ts
import { supabase } from "@/lib/supabase.client"
import { useEffect, useState } from "react"
import { User, AuthError } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // 檢查當前用戶
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // 監聽登錄狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const signUp = async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  const signOut = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}