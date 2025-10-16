"use client"

import { use, useState } from "react"
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import PetConfirmDialog from "@/component/confirmDialog/PetConfirmDialog"

// 示範寵物資料
const petsData: Record<string, any> = {
  "1": {
    id: "1",
    petName: "小白",
    pet_image: "/cute-white-dog.png",
    gender: "公",
    variety: "柴犬",
    shelter_name: "台北市動物之家",
    age: "2歲",
    weight: "10公斤",
    color: "白色",
    isAdopted: false,
    description: "小白是一隻活潑可愛的柴犬，個性溫和親人，喜歡和人互動玩耍。已完成絕育手術和疫苗接種，健康狀況良好。",
    personality: ["親人", "活潑", "聰明", "愛玩"],
  },
  "2": {
    id: "2",
    petName: "咪咪",
    pet_image: "/orange-tabby-cat.png",
    gender: "母",
    variety: "橘貓",
    shelter_name: "新北市動物收容所",
    age: "1歲",
    weight: "4公斤",
    color: "橘色",
    isAdopted: false,
    description: "咪咪是一隻溫柔的橘貓，喜歡安靜的環境，適合陪伴型的家庭。已完成絕育和疫苗接種。",
    personality: ["溫柔", "安靜", "獨立", "親人"],
  },
  "3": {
    id: "3",
    petName: "黑皮",
    pet_image: "/black-labrador.png",
    gender: "公",
    variety: "拉布拉多",
    shelter_name: "桃園市動物保護教育園區",
    age: "3歲",
    weight: "28公斤",
    color: "黑色",
    isAdopted: true,
    description: "黑皮是一隻忠誠的拉布拉多，精力充沛，需要較大的活動空間。適合喜歡戶外活動的家庭。",
    personality: ["忠誠", "活潑", "友善", "精力充沛"],
  },
  "4": {
    id: "4",
    petName: "花花",
    pet_image: "/calico-cat.png",
    gender: "母",
    variety: "三花貓",
    shelter_name: "台中市動物之家",
    age: "2歲",
    weight: "3.5公斤",
    color: "三花",
    isAdopted: false,
    description: "花花是一隻美麗的三花貓，個性獨立但也喜歡撒嬌。適合有養貓經驗的家庭。",
    personality: ["獨立", "聰明", "愛撒嬌", "優雅"],
  },
  "5": {
    id: "5",
    petName: "阿福",
    pet_image: "/golden-retriever.png",
    gender: "公",
    variety: "黃金獵犬",
    shelter_name: "高雄市動物保護處",
    age: "4歲",
    weight: "32公斤",
    color: "金黃色",
    isAdopted: false,
    description: "阿福是一隻溫柔的黃金獵犬，非常適合有小孩的家庭。個性穩重，喜歡陪伴家人。",
    personality: ["溫柔", "穩重", "友善", "愛小孩"],
  },
  "6": {
    id: "6",
    petName: "小灰",
    pet_image: "/gray-british-shorthair-cat.jpg",
    gender: "母",
    variety: "英國短毛貓",
    shelter_name: "台南市動物之家",
    age: "1.5歲",
    weight: "4.5公斤",
    color: "灰色",
    isAdopted: true,
    description: "小灰是一隻優雅的英國短毛貓，個性溫和，適應力強。是理想的室內寵物。",
    personality: ["溫和", "安靜", "優雅", "適應力強"],
  },
}

export default function PetDetailPage({ params }: { params: Promise<{ petId: string }> }) {
  const { petId } = use(params)
  const router = useRouter()
  const pet = petsData[petId]
  const [openDialog, setOpenDialog] = useState(false)
    
  const handleAdoptClick = () => {
    setOpenDialog(true)
  }

  const handleConfirmAdopt = () => {
    // 這裡可以添加實際的領養邏輯
    alert(`感謝您願意領養 ${pet.petName}！我們會盡快與您聯繫。`)
    setOpenDialog(false)
  }

  const handleCancelAdopt = () => {
    setOpenDialog(false)
  }

  if (!pet) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4">找不到此寵物資訊</Typography>
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
                src={pet.pet_image}
                alt={pet.petName}
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
                    {pet.petName}
                  </Typography>
                  <Chip
                    icon={pet.isAdopted ? <CheckCircleIcon /> : <FavoriteIcon />}
                    label={pet.isAdopted ? "已被領養" : "可領養"}
                    color={pet.isAdopted ? "default" : "success"}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
                  {pet.personality.map((trait: string) => (
                    <Chip key={trait} label={trait} color="primary" variant="outlined" />
                  ))}
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

                  <Box sx={{ display: "flex", gap: 4, mt: 2 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        年齡
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.age}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        體重
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.weight}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        毛色
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {pet.color}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    寵物介紹
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                    {pet.description}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={pet.isAdopted ? <CancelIcon /> : <FavoriteIcon />}
                  onClick={handleAdoptClick}
                  disabled={pet.isAdopted}
                  sx={{
                    mt: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                  }}
                >
                  {pet.isAdopted ? "此寵物已被領養" : `我想領養 ${pet.petName}`}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <PetConfirmDialog
        pet={{
          id: pet.id,
          petName: pet.petName,
          petImage: pet.pet_image,
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
