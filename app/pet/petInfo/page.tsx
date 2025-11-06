"use client"

import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent,
} from "@mui/material"
import { useRouter } from "next/navigation"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import FavoriteIcon from "@mui/icons-material/Favorite"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import WarningIcon from "@mui/icons-material/Warning"
import PetsIcon from "@mui/icons-material/Pets"
import HomeIcon from "@mui/icons-material/Home"
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn"
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import LooksOneIcon from "@mui/icons-material/LooksOne"
import LooksTwoIcon from "@mui/icons-material/LooksTwo"
import Looks3Icon from "@mui/icons-material/Looks3"
import Looks4Icon from "@mui/icons-material/Looks4"
import MainCard from "@/component/card/mainCard"

const PetInfoPage = () => {
  const router = useRouter()

  const adoptionRequirements = [
    {
      title: "經濟能力",
      description: "需具備穩定的經濟來源，能夠負擔寵物的日常開銷，包括飼料、醫療、美容等費用。",
      icon: <MonetizationOnIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: "居住環境",
      description: "提供適合寵物生活的居住空間，確保環境安全舒適，並獲得家人或室友的同意。",
      icon: <HomeIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: "時間陪伴",
      description: "每天需要投入足夠的時間陪伴寵物，包括餵食、遛狗、玩耍等日常照顧。",
      icon: <AccessTimeIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: "醫療照護",
      description: "定期帶寵物進行健康檢查、施打疫苗、驅蟲等預防性醫療，並在生病時及時就醫。",
      icon: <HealthAndSafetyIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: "家人同意",
      description: "全家人都願意接納新成員，共同承擔照顧責任，不會因為個人因素而棄養。",
      icon: <FamilyRestroomIcon sx={{ fontSize: 28 }} />,
    },
    {
      title: "長期承諾",
      description: "願意陪伴寵物一生（10-15年以上），無論遇到任何困難都不輕言放棄。",
      icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
    },
  ]

  const adoptionProcess = [
    {
      step: 1,
      title: "瀏覽寵物資訊",
      description: "在網站上瀏覽可領養的寵物，選擇適合自己的毛孩。",
      icon: <LooksOneIcon sx={{ fontSize: 32 }} />,
    },
    {
      step: 2,
      title: "提交領養申請",
      description: "填寫領養申請表，提供個人資料和居住環境資訊。",
      icon: <LooksTwoIcon sx={{ fontSize: 32 }} />,
    },
    {
      step: 3,
      title: "審核與訪視",
      description: "收容所會審核您的申請，並可能進行家訪以確認環境合適。",
      icon: <Looks3Icon sx={{ fontSize: 32 }} />,
    },
    {
      step: 4,
      title: "完成領養",
      description: "審核通過後，簽署領養同意書，繳交必要費用，即可帶毛孩回家！",
      icon: <Looks4Icon sx={{ fontSize: 32 }} />,
    },
  ]

  const importantNotes = [
    "領養前請務必考慮清楚，寵物是生命不是玩具",
    "請勿因一時衝動而領養，避免日後棄養造成二度傷害",
    "領養後需定期回報寵物狀況，並接受收容所的追蹤訪視",
    "若因故無法繼續飼養，請務必聯繫原收容所協助送養",
    "請遵守動物保護法相關規定，善待您的寵物",
  ]

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/")}
          sx={{ mb: 4, textTransform: "none" }}
        >
          返回首頁
        </Button>

        {/* 標題區域 */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 2 }}>
            <PetsIcon sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h2" component="h1" sx={{ fontWeight: 700 }}>
              領養須知
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", lineHeight: 1.8 }}>
            領養寵物是一項需要深思熟慮的決定，代表著您願意對一個生命負起長期的責任。
            請仔細閱讀以下須知，確保您已做好充分準備。
          </Typography>
        </Box>

        {/* 領養前須知 */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}>
            領養前須知
          </Typography>
          <Grid container spacing={4}>
            {adoptionRequirements.map((requirement, index) => (
              <MainCard
                key={index}
                title={requirement.title}
                description={requirement.description}
                icon={requirement.icon}
              />
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* 領養流程 */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}>
            領養流程
          </Typography>
          <Grid container spacing={4}>
            {adoptionProcess.map((process) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={process.step}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        backgroundColor: "primary.main",
                        color: "white",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      {process.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
                      {process.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {process.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }} />

        {/* 重要提醒 */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 4, textAlign: "center" }}>
            重要提醒
          </Typography>
          <Paper
            sx={{
              p: 4,
              backgroundColor: "warning.light",
              border: 2,
              borderColor: "warning.main",
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <WarningIcon sx={{ fontSize: 36, color: "warning.dark" }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: "warning.dark" }}>
                請務必注意
              </Typography>
            </Box>
            <List>
              {importantNotes.map((note, index) => (
                <ListItem key={index} sx={{ py: 1 }}>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: "warning.dark" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={note}
                    primaryTypographyProps={{
                      fontSize: "1rem",
                      color: "warning.dark",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* CTA 按鈕 */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="h6" sx={{ mb: 3, color: "text.secondary" }}>
            準備好迎接新家庭成員了嗎？
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PetsIcon />}
            onClick={() => router.push("/")}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
            }}
          >
            開始尋找我的毛孩
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default PetInfoPage