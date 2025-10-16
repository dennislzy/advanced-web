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
interface SearchBarProps {
  placeholderText: string
}
export default function SearchBar({ placeholderText }: SearchBarProps) {
  const [searchValue, setSearchValue] = useState("")

  const handleClear = () => {
    setSearchValue("")
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
          placeholder={placeholderText}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <IconButton
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