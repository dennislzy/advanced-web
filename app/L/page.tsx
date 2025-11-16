'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Lock as LockIcon } from '@mui/icons-material'
import { supabase } from '@/config/supabase.client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // ✅ 使用 Supabase 進行登錄
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (signInError) {
        console.error('登錄錯誤:', signInError)
        setError(signInError.message || '登錄失敗，請檢查您的電郵和密碼')
        return
      }

      if (data.user) {
        console.log('登錄成功:', data.user.email)
        // 登錄成功後重定向到首頁
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      console.error('未預期的錯誤:', err)
      setError('發生未預期的錯誤，請稍後再試')
    } finally {
      setLoading(false)
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
          {/* 標題區域 */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#5b4fe5',
                mb: 2,
              }}
            >
              <LockIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#1f2937',
                mb: 1,
              }}
            >
              登錄
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              歡迎回來，請登錄您的帳戶
            </Typography>
          </Box>

          {/* 錯誤提示 */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* 表單 */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="電郵地址"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: '#f3f4f6',
                      color: '#1f2937',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5b4fe5',
                      },
                    },
                  },
                  inputLabel: {
                    sx: {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#5b4fe5',
                      },
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                label="密碼"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: '#f3f4f6',
                      color: '#1f2937',
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#5b4fe5',
                      },
                    },
                  },
                  inputLabel: {
                    sx: {
                      color: '#6b7280',
                      '&.Mui-focused': {
                        color: '#5b4fe5',
                      },
                    },
                  },
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Link
                  href="/forgot-password"
                  sx={{
                    fontSize: '0.875rem',
                    color: '#5b4fe5',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  忘記密碼？
                </Link>
              </Box>

              <Button
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
                sx={{
                  backgroundColor: '#5b4fe5',
                  color: 'white',
                  padding: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                  },
                  '&:disabled': {
                    backgroundColor: '#8b7fd9',
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  '登錄'
                )}
              </Button>
            </Stack>
          </form>

          {/* 註冊連結 */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              還沒有帳戶？{' '}
              <Link
                href="/signup"
                sx={{
                  color: '#5b4fe5',
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                立即註冊
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
