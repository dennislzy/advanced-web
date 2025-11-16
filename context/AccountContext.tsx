"use client"

import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { supabase } from "@/config/supabase.client"
import { User } from "@supabase/supabase-js"

interface AccountContextType {
  account: string | null
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export function AccountProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ 獲取當前用戶
    const getUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('獲取用戶錯誤:', error)
          setUser(null)
        } else {
          setUser(currentUser)
        }
      } catch (error) {
        console.error('未預期的錯誤:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    getUser()

    // ✅ 監聽認證狀態變化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('認證狀態變化:', event, session?.user?.email)

        if (session?.user) {
          setUser(session.user)
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    // 清理訂閱
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // ✅ 登出函數
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('登出錯誤:', error)
        throw error
      }
      setUser(null)
    } catch (error) {
      console.error('登出失敗:', error)
      throw error
    }
  }

  const value: AccountContextType = {
    account: user?.email || null,
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  }

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  )
}

export function useAccount() {
  const context = useContext(AccountContext)
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider")
  }
  return context
}
