"use client"

import { use, useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material"
import { useRouter } from "next/navigation"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import PetsIcon from "@mui/icons-material/Pets"
import HomeIcon from "@mui/icons-material/Home"
import FavoriteIcon from "@mui/icons-material/Favorite"
import PetConfirmDialog from "@/component/confirmDialog/PetConfirmDialog"
import { Pet } from "@/model/petModel"
import Loading from "@/component/loading/Loading"

export default function PetDetailPage({ params }: { params: Promise<{ pet_id: string }> }) {
  const { pet_id } = use(params)
  const router = useRouter()
  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/pets/${pet_id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('找不到此寵物資訊')
          } else {
            setError('載入寵物資料時發生錯誤')
          }
          return
        }

        const data = await response.json()
        setPet(data)
      } catch (err) {
        console.error('Error fetching pet:', err)
        setError('載入寵物資料時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchPet()
  }, [pet_id])
    
  const handleAdoptClick = () => {
    setOpenDialog(true)
  }

  const handleConfirmAdopt = async () => {
    if (!pet) return

    try {
      // TODO: 替換成實際的用戶帳號（需要實現用戶認證系統）
      const user_account = "test1@gmail.com"

      // 1. 創建領養記錄
      const adoptResponse = await fetch('/api/adopt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pet_id: pet.pet_id,
          user_account: user_account
        })
      })

      if (!adoptResponse.ok) {
        throw new Error('領養申請失敗')
      }

      // 2. 更新寵物的領養狀態為 '否' (已領養)
      const updateResponse = await fetch(`/api/pets/${pet.pet_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adopt_status: '否'
        })
      })

      if (!updateResponse.ok) {
        console.error('更新寵物狀態失敗')
      }

      alert(`感謝您願意領養 ${pet.pet_name}！我們會盡快與您聯繫。`)
      setOpenDialog(false)

      // 重新載入寵物資料以顯示最新狀態
      const refreshResponse = await fetch(`/api/pets/${pet_id}`)
      if (refreshResponse.ok) {
        const updatedPet = await refreshResponse.json()
        setPet(updatedPet)
      }
    } catch (error) {
      console.error('Error adopting pet:', error)
      alert('領養申請過程中發生錯誤，請稍後再試。')
    }
  }

  const handleCancelAdopt = () => {
    setOpenDialog(false)
  }

  if (loading) {
    return <Loading/>
  }

  if (error || !pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">{error || '找不到此寵物資訊'}</Typography>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>
          返回首頁
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/")} sx={{ mb: 4, textTransform: "none" }}>
          返回列表
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={pet.pet_image || '/placeholder-pet.png'}
                alt={pet.pet_name}
                sx={{
                  width: "100%",
                  height: { xs: 400, md: "100%" },
                  objectFit: "cover",
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                    {pet.pet_name}
                  </Typography>
                  <Chip
                    icon={<FavoriteIcon />}
                    label={pet.adopt_status === '是' ? '可領養' : '已領養'}
                    color="success"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {pet.gender === "公" ? (
                      <MaleIcon sx={{ color: "info.main", fontSize: 28 }} />
                    ) : (
                      <FemaleIcon sx={{ color: "error.main", fontSize: 28 }} />
                    )}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        性別
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.gender}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PetsIcon sx={{ color: "primary.main", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        品種
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.variety}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <HomeIcon sx={{ color: "success.main", fontSize: 28 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        收容所
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.shelter_name}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {pet.introduction && (
                  <Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      寵物介紹
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {pet.introduction}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<FavoriteIcon />}
                  onClick={handleAdoptClick}
                  disabled={pet.adopt_status === '否'}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  我想領養 {pet.pet_name}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <PetConfirmDialog
        pet={{
          id: pet.pet_id,
          petName: pet.pet_name,
          petImage: pet.pet_image || '/placeholder-pet.png',
          gender: pet.gender,
          variety: pet.variety,
          shelterName: pet.shelter_name
        }}
        open={openDialog}
        onConfirm={handleConfirmAdopt}
        onCancel={handleCancelAdopt}
      />
    </Box>
  )
}
