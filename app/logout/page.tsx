// app/logout/page.tsx
'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "../hook/useAuth"

export default function LogoutPage() {
  const { signOut } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut()
        setTimeout(() => {
          router.push('/login')
        }, 2000) // 2秒後跳轉
      } catch (error) {
        console.error('登出錯誤:', error)
        setLoading(false)
      }
    }

    handleLogout()
  }, [signOut, router])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      textAlign: 'center'
    }}>
      {loading ? (
        <>
          <h1 style={{ marginBottom: '20px' }}>正在登出...</h1>
          <p style={{ color: '#666' }}>即將跳轉到登錄頁面</p>
        </>
      ) : (
        <>
          <h1 style={{ marginBottom: '20px', color: 'red' }}>登出失敗</h1>
          <button
            onClick={() => router.push('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            返回登錄頁
          </button>
        </>
      )}
    </div>
  )
}