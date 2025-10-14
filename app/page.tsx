'use client'
import { Container, Box, Typography, Grid, Paper } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import AnnouncementIcon from "@mui/icons-material/Announcement"
import { Header } from "@/component/header/header"
import { Footer } from "@/component/footer/footer"
import MainCard from "@/component/card/mainCard"
const cardData = [
  {
    title: "寵物領養",
    description: "瀏覽我們的寵物資料庫，了解每一位毛孩的詳細資訊、個性特點和照護需求。",
    icon: <FavoriteIcon />,
  },
  {
    title: "寵物醫療",
    description: "查看最新的活動資訊、照護提醒和重要通知，確保您不會錯過任何重要訊息。",
    icon: <AnnouncementIcon />,
  },
]
export default function Home() {
  return (
    <div>
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg" sx={{ px: 2, py: { xs: 8, md: 16 } }}>
          <Box sx={{ maxWidth: 900, mx: "auto", textAlign: "center" }}>
            {/* 標題區塊 */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.25rem", md: "3rem", lg: "3.75rem" },
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              歡迎來到寵物之家
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: "1.125rem", md: "1.25rem" },
                fontWeight: 400,
                lineHeight: 1.75,
                color: "text.secondary",
                mb: 6,
              }}
            >
              我們致力於為每一位毛孩提供最溫暖的家，最專業的照護，以及最快樂的生活體驗。
            </Typography>

            {/* 卡片區塊 */}
            <Grid container spacing={3} sx={{ mt: 6 }} display="flex" justifyContent="center">
              {cardData.map((card, index) => (
                <MainCard key={index} title={card.title} description={card.description} icon={card.icon} />
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
    </div>
  )
}