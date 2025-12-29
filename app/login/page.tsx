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
import { Lock as LockIcon, Pets as PetsIcon } from '@mui/icons-material'
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (signInError) {
        console.error('登入錯誤:', signInError)
        setError(signInError.message || '登入失敗，請檢查您的電郵和密碼')
        return
      }

      if (data.user) {
        console.log('登入成功:', data.user.email)
        router.push('/pet')
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
        background: 'radial-gradient(circle at top, #eef2ff 0%, #f9fafb 40%, #f3f4f6 100%)',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* 用 flex 取代 Grid */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* 左側：品牌區塊 */}
            <Box
              sx={{
                width: { xs: '100%', md: '40%' },
                background: 'linear-gradient(145deg, #6366f1 0%, #8b5cf6 45%, #ec4899 100%)',
                color: 'white',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '30%',
                      backgroundColor: 'rgba(255,255,255,0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PetsIcon sx={{ fontSize: 24, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                      寵物之家 · Pet Paradise
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      給每一隻毛孩一個家
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    lineHeight: 1.3,
                  }}
                >
                  歡迎回來，照顧毛孩的夥伴
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  登入後即可查看您的領養申請、收藏的毛孩，以及最新的寵物照護資訊。
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'rgba(15,23,42,0.25)',
                    border: '1px solid rgba(249,250,251,0.2)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    小提醒 🐾
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    · 使用註冊時的電郵與密碼登入
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    · 若忘記密碼，可以透過「忘記密碼」重新設定
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{ mt: 4, opacity: 0.8, textAlign: 'right' }}
              >
                一起為每一位毛小孩找到溫暖的家 ❤️
              </Typography>
            </Box>

            {/* 右側：登入表單 */}
            <Box
              sx={{
                width: { xs: '100%', md: '60%' },
                p: { xs: 3, md: 4 },
                backgroundColor: '#ffffff',
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#eef2ff',
                    mb: 1.5,
                  }}
                >
                  <LockIcon sx={{ color: '#6366f1', fontSize: 26 }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#111827',
                    mb: 0.5,
                    fontSize: { xs: '1.7rem', md: '2rem' },
                  }}
                >
                  會員登入
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  使用您的帳戶登入，繼續為毛孩尋找幸福
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    label="電郵地址"
                    type="email"
                    id = "email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#cbd5f5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          color: '#6b7280',
                          '&.Mui-focused': {
                            color: '#4f46e5',
                          },
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="密碼"
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#cbd5f5',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#6366f1',
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          color: '#6b7280',
                          '&.Mui-focused': {
                            color: '#4f46e5',
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
                        color: '#4f46e5',
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
                      backgroundColor: '#6366f1',
                      color: 'white',
                      py: 1.4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      boxShadow: '0 10px 20px rgba(99,102,241,0.25)',
                      '&:hover': {
                        backgroundColor: '#4f46e5',
                        boxShadow: '0 12px 22px rgba(79,70,229,0.28)',
                      },
                      '&:disabled': {
                        backgroundColor: '#a5b4fc',
                        color: 'rgba(255,255,255,0.8)',
                        boxShadow: 'none',
                      },
                    }}
                    id='login-button'
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      '登入'
                    )}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  還沒有帳戶？{' '}
                  <Link
                    href="/signup"
                    sx={{
                      color: '#4f46e5',
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
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
