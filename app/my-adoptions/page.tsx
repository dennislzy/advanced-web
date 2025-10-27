"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material"
import { useRouter } from "next/navigation"
import PetsIcon from "@mui/icons-material/Pets"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { AdoptRecord } from "@/model/adoptModel"
import Loading from "@/component/loading/Loading"

export default function MyAdoptionsPage() {
  const router = useRouter()
  const [adoptions, setAdoptions] = useState<AdoptRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // TODO: 替換成實際的用戶帳號（需要實現用戶認證系統）
  const user_account = "test1@gmail.com"

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/adopt/${encodeURIComponent(user_account)}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('找不到領養記錄')
          } else {
            setError('載入領養記錄時發生錯誤')
          }
          return
        }

        const data = await response.json()
        setAdoptions(data)
      } catch (err) {
        console.error('Error fetching adoptions:', err)
        setError('載入領養記錄時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [user_account])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" color="error">{error}</Typography>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>
          返回首頁
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/")}
          sx={{ mb: 4, textTransform: "none" }}
        >
          返回首頁
        </Button>

        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <FavoriteIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            我的領養記錄
          </Typography>
        </Box>

        {adoptions.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <PetsIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              您還沒有領養任何寵物
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/")}
              sx={{ mt: 3, textTransform: "none" }}
            >
              瀏覽可領養寵物
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              共有 {adoptions.length} 筆領養記錄
            </Typography>

            <Grid container spacing={3}>
              {adoptions.map((adoption) => (
                <Grid item xs={12} sm={6} md={4} key={adoption.record_id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/pet/${adoption.pet.pet_id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image='/placeholder-pet.png'
                      alt={adoption.pet.pet_name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", mb: 2 }}>
                        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                          {adoption.pet.pet_name}
                        </Typography>
                        <Chip
                          icon={<FavoriteIcon />}
                          label="已領養"
                          color="success"
                          size="small"
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        品種：{adoption.pet.variety}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        性別：{adoption.pet.gender}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        收容所：{adoption.pet.shelter_name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  )
}
