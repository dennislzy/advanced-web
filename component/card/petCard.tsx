"use client"

import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material"
import { useRouter } from "next/navigation"
import PetsIcon from "@mui/icons-material/Pets"
import MaleIcon from "@mui/icons-material/Male"
import FemaleIcon from "@mui/icons-material/Female"
import HomeIcon from "@mui/icons-material/Home"

export interface Pet {
  id: string
  petName: string
  petImage: string
  gender: string
  variety: string
  shelterName: string
}

export interface PetCardProps {
  pet: Pet
}

export default function PetCard({ pet }: PetCardProps) {
  const router = useRouter()

  const handleViewDetails = () => {
    router.push(`/pet/${pet.id}`)
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
      <CardMedia component="img" height="240" image={pet.petImage} alt={pet.petName} sx={{ objectFit: "cover" }} />
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
            {pet.petName}
          </Typography>
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
              {pet.shelterName}
            </Typography>
          </Box>
        </Box>

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
      </CardContent>
    </Card>
  )
}
