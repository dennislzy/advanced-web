"use client"
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import ClearIcon from "@mui/icons-material/Clear"
import { useState } from "react"
import { Pet } from "../card/petCard"

interface SearchBarProps {
  placeholderText: string
  onSearchResults?: (pets: Pet[]) => void
  onLoadingChange?: (loading: boolean) => void
}

export default function SearchBar({
  placeholderText,
  onSearchResults,
  onLoadingChange
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = async () => {
    if (!onSearchResults) return

    try {
      onLoadingChange?.(true)
      const url = searchValue
        ? `/api/pets?variety=${encodeURIComponent(searchValue)}`
        : '/api/pets'

      const response = await fetch(url)
      const data = await response.json()
      onSearchResults(data)
    } catch (error) {
      console.error('搜尋失敗：', error)
    } finally {
      onLoadingChange?.(false)
    }
  }

  const handleClear = () => {
    setSearchValue("")
    // 清空時重新載入全部寵物
    handleSearch()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Box sx={{ width: "100%", maxWidth: 800, mx: "auto", mb: 4 }}>
      <Paper
        elevation={2}
        sx={{
          p: 1,
          borderRadius: 3,
          background: "linear-gradient(145deg, #ffffff 0%, #fafafa 100%)",
          border: "1px solid",
          borderColor: "grey.200",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: 4,
            borderColor: "primary.light",
          },
        }}
      >
        <TextField
          fullWidth
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholderText}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
                  onClick={handleSearch}
                  sx={{
                    p: 1.5,
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.light",
                      color: "white",
                    },
                  }}
                >
                  <SearchIcon fontSize="medium" />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: searchValue && (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClear}
                  sx={{
                    p: 1,
                    mr: 1,
                    color: "grey.500",
                    "&:hover": {
                      bgcolor: "grey.100",
                      color: "grey.700",
                    },
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              fontSize: "1.1rem",
              px: 2,
              py: 1.5,
              "& input::placeholder": {
                color: "grey.500",
                opacity: 0.8,
              },
            },
          }}
        />
      </Paper>
    </Box>
  )
}