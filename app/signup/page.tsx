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

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致')
      setLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
      })

      if (signUpError) {
        console.error('註冊錯誤:', signUpError)
        setError(signUpError.message || '註冊失敗，請稍後再試')
        return
      }

      console.log('註冊成功:', data)
      setSuccess('註冊成功！若有啟用信箱驗證，請前往信箱收取驗證信。')
      router.push('/L')
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
        background: 'radial-gradient(circle at top, #fefce8 0%, #f9fafb 40%, #f3f4f6 100%)',
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
          {/* 外層 flex */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* 左側說明區 */}
            <Box
              sx={{
                width: { xs: '100%', md: '40%' },
                background: 'linear-gradient(145deg, #f97316 0%, #ec4899 45%, #6366f1 100%)',
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
                      加入寵物之家
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      與我們一起照顧與陪伴
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
                  建立你的專屬帳戶
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                  註冊後即可送出領養申請、追蹤喜歡的毛孩，並收到專屬的照護提醒與最新消息。
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
                    註冊好處 🐶🐱
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    · 儲存與管理你的領養申請紀錄
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                    · 收藏心儀的毛孩，隨時回來關注
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    · 接收重要通知與照護建議
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{ mt: 4, opacity: 0.85, textAlign: 'right' }}
              >
                每一次註冊，都是為毛孩多增加一個可能的家 🧡
              </Typography>
            </Box>

            {/* 右側表單區 */}
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
                    backgroundColor: '#fff7ed',
                    mb: 1.5,
                  }}
                >
                  <LockIcon sx={{ color: '#f97316', fontSize: 26 }} />
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
                  註冊新帳戶
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  使用 email 建立帳戶，開始你的寵物旅程
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

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
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#fed7aa',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f97316',
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          color: '#6b7280',
                          '&.Mui-focused': {
                            color: '#ea580c',
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
                          backgroundColor: '#f9fafb',
                          '& fieldset': {
                            borderColor: '#e5e7eb',
                          },
                          '&:hover fieldset': {
                            borderColor: '#fed7aa',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f97316',
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          color: '#6b7280',
                          '&.Mui-focused': {
                            color: '#ea580c',
                          },
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="確認密碼"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            borderColor: '#fed7aa',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#f97316',
                          },
                        },
                      },
                      inputLabel: {
                        sx: {
                          color: '#6b7280',
                          '&.Mui-focused': {
                            color: '#ea580c',
                          },
                        },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    type="submit"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      py: 1.4,
                      fontSize: '1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      borderRadius: 1.5,
                      boxShadow: '0 10px 20px rgba(248,113,22,0.25)',
                      '&:hover': {
                        backgroundColor: '#ea580c',
                        boxShadow: '0 12px 22px rgba(234,88,12,0.28)',
                      },
                      '&:disabled': {
                        backgroundColor: '#fed7aa',
                        color: 'rgba(255,255,255,0.9)',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      '註冊'
                    )}
                  </Button>
                </Stack>
              </form>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  已經有帳戶了？{' '}
                  <Link
                    href="/L"
                    sx={{
                      color: '#f97316',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    前往登入
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
