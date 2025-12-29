"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CardActions,
  Stack,
  CircularProgress,
} from "@mui/material"
import { useRouter } from "next/navigation"
import PetsIcon from "@mui/icons-material/Pets"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import HomeIcon from "@mui/icons-material/Home"
import EditIcon from "@mui/icons-material/Edit"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { Pet } from "@/model/petModel"
import { supabase } from "@/config/supabase.client"

const ADMIN_EMAIL = "jeff1050032@gmail.com"

export interface PetCardProps {
  pet: Pet
  statusChip?: React.ReactNode // 可選的狀態標籤（如 "已領養" chip）
  actions?: React.ReactNode // 可選的自定義按鈕區域
  showViewDetailsButton?: boolean // 是否顯示查看詳細資訊按鈕，預設為 true
  onDelete?: (petId: string) => void // 刪除成功後的回調函數
}

export default function PetCard({
  pet,
  statusChip,
  actions,
  showViewDetailsButton = true,
  onDelete,
}: PetCardProps) {
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false) // ✅ 跟上架權限一致：只要登入即可
  const [unpublishLoading, setUnpublishLoading] = useState(false)

  useEffect(() => {
    let alive = true

    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!alive) return

      if (error || !data.user) {
        setIsAuthed(false)
        setIsAdmin(false)
        return
      }

      setIsAuthed(true)

      const email = (data.user.email ?? "").toLowerCase()
      setIsAdmin(email === ADMIN_EMAIL)
    }

    checkAuth()

    return () => {
      alive = false
    }
  }, [])

  const handleViewDetails = () => {
    router.push(`/pet/${pet.pet_id}`)
  }

  const handleEdit = () => {
    router.push(`/pet/${pet.pet_id}/edit`)
  }

  // ✅ 下架：呼叫 /api/pets/[pet_id]/unpublish（登入即可）
  const handleUnpublish = async () => {
    if (!isAuthed) {
      alert("請先登入才能下架寵物")
      return
    }

    const ok = confirm(`確定要下架「${pet.pet_name}」嗎？`)
    if (!ok) return

    setUnpublishLoading(true)
    try {
      const res = await fetch(`/api/pets/${pet.pet_id}/unpublish`, {
        method: "DELETE",
      })

      const raw = await res.text()
      if (!res.ok) {
        throw new Error(`下架失敗（${res.status}）：${raw.slice(0, 200)}`)
      }

      alert("下架成功！")
      // 調用回調函數通知父組件更新列表
      if (onDelete) {
        onDelete(pet.pet_id)
      }
      router.refresh() // 讓列表重新抓資料
    } catch (err) {
      console.error("下架寵物失敗：", err)
      alert(err instanceof Error ? err.message : "下架失敗，請稍後再試")
    } finally {
      setUnpublishLoading(false)
    }
  }

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-8px)",
          boxShadow: 6,
        },
        borderRadius: 3,
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={pet.pet_image || "/placeholder-pet.png"}
        alt={pet.pet_name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {pet.pet_name}
          </Typography>
          {statusChip}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {pet.gender === "公" ? (
              <MaleIcon sx={{ color: "info.main", fontSize: 20 }} />
            ) : (
              <FemaleIcon sx={{ color: "error.main", fontSize: 20 }} />
            )}
            <Typography variant="body2" color="text.secondary">
              性別：{pet.gender}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PetsIcon sx={{ color: "primary.main", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary">
              品種：{pet.variety}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeIcon sx={{ color: "success.main", fontSize: 20 }} />
            <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
              {pet.shelter_name}
            </Typography>
          </Box>
        </Box>

        {/* ✅ 按鈕區：修改(只有 Jeff) + 下架(只要登入，跟上架一致) */}
        <Stack spacing={1.2} sx={{ mt: 0.5 }}>
          {isAdmin && (
            <Button
              variant="outlined"
              fullWidth
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              修改寵物資訊
            </Button>
          )}

          {isAuthed && (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={
                unpublishLoading ? (
                  <CircularProgress size={18} />
                ) : (
                  <DeleteOutlineIcon />
                )
              }
              disabled={unpublishLoading}
              onClick={handleUnpublish}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 600,
              }}
            >
              下架寵物
            </Button>
          )}
        </Stack>

        {showViewDetailsButton && (
          <Button
            variant="contained"
            fullWidth
            onClick={handleViewDetails}
            sx={{
              mt: "auto",
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            查看詳細資訊
          </Button>
        )}
      </CardContent
      {actions && <CardActions sx={{ p: 2, pt: 0 }}>{actions}</CardActions>}
    </Card>
  )
}
