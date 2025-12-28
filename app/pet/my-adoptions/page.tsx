"use client"

import { useState, useEffect } from "react"
import {
  Container,
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material"
import { useRouter } from "next/navigation"
import PetsIcon from "@mui/icons-material/Pets"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import DeleteIcon from "@mui/icons-material/Delete"
import { AdoptRecord } from "@/model/adoptModel"
import Loading from "@/component/loading/Loading"
import PetCard from "@/component/card/petCard"

export default function MyAdoptionsPage() {
  const router = useRouter()
  const [adoptions, setAdoptions] = useState<AdoptRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  // TODO: 替換成實際的用戶帳號（需要實現用戶認證系統）
  const user_account = "test1@gmail.com"

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/adopt/${encodeURIComponent(user_account)}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('找不到領養記錄')
          } else {
            setError('載入領養記錄時發生錯誤')
          }
          return
        }

        const data = await response.json()
        setAdoptions(data)
      } catch (err) {
        console.error('Error fetching adoptions:', err)
        setError('載入領養記錄時發生錯誤')
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [user_account])

  const handleDeleteClick = (recordId: number, event: React.MouseEvent) => {
    event.stopPropagation() // 防止觸發卡片的點擊事件
    setSelectedRecordId(recordId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRecordId) return

    // 找到要刪除的領養記錄
    const adoptionToDelete = adoptions.find(adoption => adoption.record_id === selectedRecordId)
    if (!adoptionToDelete) return

    try {
      setDeleting(true)

      // 刪除領養記錄（後端會自動更新寵物狀態為可領養）
      const deleteResponse = await fetch(`/api/adopt/record/${selectedRecordId}`, {
        method: 'DELETE',
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json().catch(() => ({ error: '刪除失敗' }))
        throw new Error(errorData.error || '刪除失敗')
      }

      // 從列表中移除已刪除的項目
      setAdoptions(adoptions.filter(adoption => adoption.record_id !== selectedRecordId))
      setDeleteDialogOpen(false)
      setSelectedRecordId(null)
      alert('已成功取消領養')
    } catch (err) {
      console.error('Error deleting adoption:', err)
      alert(err instanceof Error ? err.message : '取消領養失敗，請稍後再試')
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setSelectedRecordId(null)
  }

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" color="error">{error}</Typography>
        <Button onClick={() => router.push("/")} sx={{ mt: 2 }}>
          返回首頁
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 2 }}>
          <FavoriteIcon sx={{ fontSize: 40, color: "primary.main" }} />
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            我的領養記錄
          </Typography>
        </Box>

        {adoptions.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "background.paper",
              borderRadius: 2,
            }}
          >
            <PetsIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              您還沒有領養任何寵物
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push("/")}
              sx={{ mt: 3, textTransform: "none" }}
            >
              瀏覽可領養寵物
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
              共有 {adoptions.length} 筆領養記錄
            </Typography>
            <Box 
              sx={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: 4, 
                justifyContent: "center" 
              }}
            >
              {adoptions.map((adoption) => (
                <Box 
                  key={adoption.record_id}
                  sx={{ 
                    width: "100%",
                    maxWidth: 850,
                    '@media (min-width: 900px)': {
                      width: 'calc(50% - 16px)', // 大屏幕顯示兩列
                    }
                  }}
                >
                <PetCard
                      pet={adoption.pet}
                      statusChip={
                        <Chip
                          icon={<FavoriteIcon />}
                          label="已領養"
                          color="success"
                          size="medium"
                        />
                      }
                      showViewDetailsButton={false}
                      actions={
                        <Button
                          fullWidth
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={(e) => handleDeleteClick(adoption.record_id, e)}
                          sx={{ textTransform: "none", py: 1.5, fontSize: "1rem" }}
                        >
                          取消領養
                        </Button>
                      }
                    />
                </Box>
              ))}
            </Box>
          </>
        )}
      </Container>

      {/* 刪除確認對話框 */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          確認取消領養
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            您確定要取消這筆領養記錄嗎？此操作無法復原。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            取消
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {deleting ? '刪除中...' : '確認刪除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
