"use client"
import PetCard from "@/component/card/petCard"
import Loading from "@/component/loading/Loading"
import SearchBar from "@/component/search/petSearch"
import { Pet } from "@/model/petModel"
import { Container, Typography, Box } from "@mui/material"
import { useEffect, useState } from "react"

export default function PetPage() {
  const [pets, setPets] = useState<Pet[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAllPet = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/pets')
        const data = await response.json()
        setPets(data)
        setIsLoading(false)
      } catch (error) {
        console.error('取得寵物資料失敗：', error)
      }
    }
    fetchAllPet()
  }, [])

  const handleSearchResults = (results: Pet[]) => {
    setPets(results)
  }

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
    <SearchBar
      placeholderText="搜尋寵物類別名稱"
      onSearchResults={handleSearchResults}
      onLoadingChange={setIsLoading}
    />
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
        {
        isLoading ? (
          <Box sx={{
            gridColumn: '1 / -1',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '300px'
          }}>
            <Loading/>
          </Box>
        ) : pets?.map((pet) => (
          <Box key={pet.pet_id}>
            <PetCard pet={pet} />
          </Box>
        ))
        }
    </Box>
    </>
  )
}