"use client"
import PetCard, { Pet } from "@/component/card/petCard"
import SearchBar from "@/component/search/petSearch"
import { Container, Typography, Box } from "@mui/material"

// 示範寵物資料
const pets: Pet[] = [
  {
    id: "1",
    petName: "小白",
    petImage: "/cute-white-dog.png",
    gender: "公",
    variety: "柴犬",
    shelterName: "台北市動物之家",
  },
  {
    id: "2",
    petName: "咪咪",
    petImage: "/orange-tabby-cat.png",
    gender: "母",
    variety: "橘貓",
    shelterName: "新北市動物收容所",
  },
  {
    id: "3",
    petName: "黑皮",
    petImage: "/black-labrador.png",
    gender: "公",
    variety: "拉布拉多",
    shelterName: "桃園市動物保護教育園區",
  },
  {
    id: "4",
    petName: "花花",
    petImage: "/calico-cat.png",
    gender: "母",
    variety: "三花貓",
    shelterName: "台中市動物之家",
  },
  {
    id: "5",
    petName: "阿福",
    petImage: "/golden-retriever.png",
    gender: "公",
    variety: "黃金獵犬",
    shelterName: "高雄市動物保護處",
  },
  {
    id: "6",
    petName: "小灰",
    petImage: "/gray-british-shorthair-cat.jpg",
    gender: "母",
    variety: "英國短毛貓",
    shelterName: "台南市動物之家",
  },
]

export default function PetPage() {
  return (
    <>
    <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 2,
        }}
        >
        尋找你的毛孩夥伴
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
        每一隻毛孩都值得一個溫暖的家，讓我們一起給他們一個充滿愛的未來
        </Typography>
    </Box>
    <SearchBar placeholderText="搜尋寵物類別名稱" />
    <Box
        sx={{
        display: "grid",
        gridTemplateColumns: {
            xs: "1fr",                              // 手機：1 欄
            sm: "repeat(2, minmax(280px, 1fr))",   // 平板：2 欄，最小 280px
            md: "repeat(3, minmax(320px, 1fr))",   // 桌機：3 欄，最小 320px
        },
        gap: "32px",                              // 32px 的間距
        justifyContent: "center",
        "& > div": {
            width: "100%",
            minWidth: {
            xs: "280px",
            sm: "280px", 
            md: "320px"
            },
            maxWidth: {
            xs: "400px",
            sm: "380px",
            md: "400px"
            },
            mx: "auto",
        },
        }}
    >
        {pets.map((pet) => (
        <Box key={pet.id}>
            <PetCard pet={pet} />
        </Box>
        ))}
    </Box>
    </>
  )
}