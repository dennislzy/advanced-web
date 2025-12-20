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
} from "@mui/material"
import { useRouter } from "next/navigation"
import PetsIcon from "@mui/icons-material/Pets"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import HomeIcon from "@mui/icons-material/Home"
import EditIcon from "@mui/icons-material/Edit"
import { Pet } from "@/model/petModel"
import { supabase } from "@/config/supabase.client"

const ADMIN_EMAIL = "jeff1050032@gmail.com"

export interface PetCardProps {
  pet: Pet
  statusChip?: React.ReactNode // 可選的狀態標籤（如 "已領養" chip）
  actions?: React.ReactNode // 可選的自定義按鈕區域
  showViewDetailsButton?: boolean // 是否顯示查看詳細資訊按鈕，預設為 true
}

export default function PetCard({
  pet,
  statusChip,
  actions,
  showViewDetailsButton = true,
}: PetCardProps) {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)

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

  const handleViewDetails = () => {
    router.push(`/pet/${pet.pet_id}`)
  }

  const handleEdit = () => {
    router.push(`/pet/${pet.pet_id}/edit`)
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

        {/* ✅ 只有指定 Gmail 才顯示「修改」 */}
        {isAdmin && (
          <Button
            variant="outlined"
            fullWidth
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              mt: 0.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
            }}
          >
            修改寵物資訊
          </Button>
        )}

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
      </CardContent>

      {actions && <CardActions sx={{ p: 2, pt: 0 }}>{actions}</CardActions>}
    </Card>
  )
}
