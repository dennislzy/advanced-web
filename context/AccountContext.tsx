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
        // 先檢查是否有 session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          console.warn('獲取 session 錯誤:', sessionError.message)
          setUser(null)
          setIsLoading(false)
          return
        }

        // 如果沒有 session，直接設置為 null（不是錯誤狀態）
        if (!session) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // 有 session 才獲取用戶資訊
        const { data: { user: currentUser }, error } = await supabase.auth.getUser()

        if (error) {
          console.warn('獲取用戶錯誤:', error.message)
          setUser(null)
        } else {
          setUser(currentUser)
        }
      } catch (error) {
        // 靜默處理 AuthSessionMissingError
        if (error instanceof Error && error.message.includes('Auth session missing')) {
          console.log('無認證 session（用戶未登錄）')
        } else {
          console.error('未預期的錯誤:', error)
        }
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
