"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Stack,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material"

export default function PetUploadPage() {
  const router = useRouter()

  // 這裡欄位名稱，要對應你後端 / Pet 型別的欄位
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")      // 例如：狗、貓、兔子…
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [location, setLocation] = useState("")      // 例如：台北市
  const [imageUrl, setImageUrl] = useState("")      // 先用圖片網址，之後要改成上傳檔案也可以
  const [description, setDescription] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      // 這裡的欄位名稱要跟你 /api/pets 的後端一致
      const payload = {
        name,
        category,
        age: Number(age),
        gender,
        location,
        image_url: imageUrl,
        description,
      }

      const res = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || "上架寵物失敗，請稍後再試")
      }

      setSuccess("寵物已成功上架！")
      // 簡單處理：1 秒後回到寵物列表頁
      setTimeout(() => {
        router.push("/pet")
      }, 1000)
    } catch (err: unknown) {
      console.error("上架寵物失敗：", err)
      if (err instanceof Error) {
        setError(err.message || "上架寵物失敗，請稍後再試")
      } else {
        setError("上架寵物失敗，請稍後再試")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: { xs: 4, md: 6 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
          }}
        >
          {/* 標題區塊 */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              上架寵物
            </Typography>
            <Typography variant="body2" color="text.secondary">
              請填寫完整的寵物資訊，幫助牠們更快找到幸福的家 🐾
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* 表單 */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                label="寵物名字"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="寵物類別"
                  fullWidth
                  select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <MenuItem value="狗">狗</MenuItem>
                  <MenuItem value="貓">貓</MenuItem>
                  <MenuItem value="兔子">兔子</MenuItem>
                  <MenuItem value="其他">其他</MenuItem>
                </TextField>

                <TextField
                  label="年齡（歲）"
                  fullWidth
                  type="number"
                  inputProps={{ min: 0 }}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="性別"
                  fullWidth
                  select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <MenuItem value="公">公</MenuItem>
                  <MenuItem value="母">母</MenuItem>
                  <MenuItem value="未知">未知</MenuItem>
                </TextField>

                <TextField
                  label="所在地區"
                  fullWidth
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例如：台北市內湖區"
                  required
                />
              </Stack>

              <TextField
                label="圖片網址"
                fullWidth
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/pet.jpg"
                required
              />

              <TextField
                label="寵物描述"
                fullWidth
                multiline
                minRows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="性格、習慣、注意事項等……"
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 1,
                }}
              >
                <Button
                  variant="outlined"
                  disabled={loading}
                  onClick={() => router.push("/pet")}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: 140 }}
                >
                  {loading ? (
                    <CircularProgress size={22} sx={{ color: "white" }} />
                  ) : (
                    "確認上架"
                  )}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}
