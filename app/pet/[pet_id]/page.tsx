"use client"

import React, { use, useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
} from "@mui/material"
import { useRouter } from "next/navigation"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import PetsIcon from "@mui/icons-material/Pets"
import HomeIcon from "@mui/icons-material/Home"
import FavoriteIcon from "@mui/icons-material/Favorite"
import EditIcon from "@mui/icons-material/Edit"
import PetConfirmDialog from "@/component/confirmDialog/PetConfirmDialog"
import { Pet } from "@/model/petModel"
import Loading from "@/component/loading/Loading"
import { supabase } from "@/config/supabase.client"

const ADMIN_EMAIL = "jeff1050032@gmail.com"

export default function PetDetailPage({
  params,
}: {
  params: Promise<{ pet_id: string }>
}) {
  const { pet_id } = use(params)
  const router = useRouter()

  const [pet, setPet] = useState<Pet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  // ✅ 檢查是否為 Jeff（顯示「修改」按鈕用）
  useEffect(() => {
    let alive = true

    const checkAdmin = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!alive) return
      if (error) {
        setIsAdmin(false)
        return
      }
      const email = (data.user?.email ?? "").toLowerCase()
      setIsAdmin(email === ADMIN_EMAIL)
    }

    checkAdmin()
    return () => {
      alive = false
    }
  }, [])

  // ✅ 取得寵物資料（注意：你的 API 是 /api/pets）
  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/pets/${pet_id}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError("找不到此寵物資訊")
          } else {
            setError("載入寵物資料時發生錯誤")
          }
          return
        }

        const data = await response.json()
        setPet(data)
      } catch (err) {
        console.error("Error fetching pet:", err)
        setError("載入寵物資料時發生錯誤")
      } finally {
        setLoading(false)
      }
    }

    fetchPet()
  }, [pet_id])

  const handleAdoptClick = () => setOpenDialog(true)

  const handleConfirmAdopt = async () => {
    if (!pet) return

    try {
      // 創建領養記錄（後端會自動更新寵物狀態）
      const adoptResponse = await fetch("/api/adopt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_id: pet.pet_id,
        }),
      })

      if (!adoptResponse.ok) {
        const errorData = await adoptResponse.json()
        throw new Error(errorData.error || "領養申請失敗")
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
      console.error("Error adopting pet:", error)
      alert(error instanceof Error ? error.message : "領養申請過程中發生錯誤，請稍後再試。")
    }
  }

  const handleCancelAdopt = () => setOpenDialog(false)

  const handleEdit = () => {
    // ✅ 路由統一走 /pets（跟你 API 一樣是 pets）
    router.push(`/pets/${pet_id}/edit`)
  }

  if (loading) return <Loading />

  if (error || !pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">{error || "找不到此寵物資訊"}</Typography>
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
          返回列表
        </Button>

        <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
          <Grid container>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src={pet.pet_image || "/placeholder-pet.png"}
                alt={pet.pet_name}
                sx={{
                  width: "100%",
                  height: { xs: 400, md: "100%" },
                  objectFit: "cover",
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    gap: 2,
                  }}
                >
                  <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
                    {pet.pet_name}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      icon={<FavoriteIcon />}
                      label={pet.adopt_status === "否" ? "可領養" : "已領養"}
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />

                    {/* ✅ 只有 Jeff 顯示 */}
                    {isAdmin && (
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={handleEdit}
                        sx={{ textTransform: "none", fontWeight: 600 }}
                      >
                        修改
                      </Button>
                    )}
                  </Box>
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
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ lineHeight: 1.8 }}
                    >
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
                  disabled={pet.adopt_status === "是"}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    bgcolor: pet.adopt_status === "是" ? "grey.400" : "primary.main",
                    "&:hover": {
                      bgcolor: pet.adopt_status === "是" ? "grey.400" : "primary.dark",
                    },
                    "&.Mui-disabled": {
                      bgcolor: "grey.400",
                      color: "grey.700",
                    },
                  }}
                >
                  {pet.adopt_status === "是" ? `${pet.pet_name} 已被領養` : `我想領養 ${pet.pet_name}`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <PetConfirmDialog
        pet={{
          pet_id: pet.pet_id,
          pet_name: pet.pet_name,
          pet_image: pet.pet_image || "/placeholder-pet.png",
          gender: pet.gender,
          variety: pet.variety,
          shelter_name: pet.shelter_name,
          created_at: pet.created_at,
          adopt_status: pet.adopt_status,
          introduction: pet.introduction,
          updated_at: pet.updated_at,
        }}
        open={openDialog}
        onConfirm={handleConfirmAdopt}
        onCancel={handleCancelAdopt}
      />
    </Box>
  )
}
