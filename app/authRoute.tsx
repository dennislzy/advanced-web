'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "./hook/useAuth"

export function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>載入中...</div>
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}