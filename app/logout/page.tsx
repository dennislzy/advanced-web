'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { supabase } from '@/config/supabase.client'

export default function LogoutPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [isLoggingOut, setIsLoggingOut] = useState(true)

  useEffect(() => {
    handleLogout()
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setError('')

      // ✅ 使用 Supabase 進行登出
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        console.error('登出錯誤:', signOutError)
        setError(signOutError.message || '登出失敗，請稍後再試')
        setIsLoggingOut(false)
        return
      }

      console.log('登出成功')

      // 登出成功後延遲一下再重定向，讓用戶看到成功訊息
      setTimeout(() => {
        router.push('/L')
        router.refresh()
      }, 1000)
    } catch (err) {
      console.error('未預期的錯誤:', err)
      setError('發生未預期的錯誤，請稍後再試')
      setIsLoggingOut(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #eff1f5 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={2}
          sx={{
            padding: 4,
            borderRadius: 2,
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          }}
        >
          {/* 圖標和標題區域 */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: isLoggingOut ? '#5b4fe5' : error ? '#ef4444' : '#10b981',
                mb: 2,
              }}
            >
              {isLoggingOut ? (
                <CircularProgress size={32} sx={{ color: 'white' }} />
              ) : (
                <LogoutIcon sx={{ color: 'white', fontSize: 32 }} />
              )}
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                mb: 1,
              }}
            >
              {isLoggingOut ? '登出中...' : error ? '登出失敗' : '登出成功'}
            </Typography>

            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {isLoggingOut
                ? '正在安全地登出您的帳戶'
                : error
                ? '無法完成登出操作'
                : '您已成功登出，即將返回登錄頁面'}
            </Typography>
          </Box>

          {/* 錯誤提示 */}
          {error && (
            <Box sx={{ mt: 3 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleLogout}
                  sx={{
                    backgroundColor: '#5b4fe5',
                    color: 'white',
                    padding: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: '#4f46e5',
                    },
                  }}
                >
                  重試
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => router.push('/')}
                  sx={{
                    borderColor: '#d1d5db',
                    color: '#6b7280',
                    padding: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 1,
                    '&:hover': {
                      borderColor: '#9ca3af',
                      backgroundColor: '#f9fafb',
                    },
                  }}
                >
                  返回首頁
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
