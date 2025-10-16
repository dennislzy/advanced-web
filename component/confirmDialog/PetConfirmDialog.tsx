import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { Pet } from "../card/petCard"

interface PetConfirmDialogProps {
  pet: Pet
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

const PetConfirmDialog = ({ pet, open, onConfirm, onCancel }: PetConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="adopt-dialog-title"
      aria-describedby="adopt-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="adopt-dialog-title" sx={{ fontWeight: 600, fontSize: "1.5rem" }}>
        確認領養
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="adopt-dialog-description" sx={{ fontSize: "1.1rem", color: "text.primary" }}>
          您確定要領養 <strong>{pet.petName}</strong> 嗎？
        </DialogContentText>
        <Box sx={{ mt: 3, p: 2, bgcolor: "info.light", borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1, color: "black" }}>
            領養須知：
          </Typography>
          <Typography variant="body2" color="text.secondary" component="ul" sx={{ pl: 2, color: "black" }}>
            <li>請確保您有足夠的時間和空間照顧寵物</li>
            <li>需要定期帶寵物進行健康檢查</li>
            <li>請給予寵物充足的愛與關懷</li>
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" size="large" sx={{ textTransform: "none" }}>
          取消
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          size="large"
          startIcon={<FavoriteIcon />}
          sx={{ textTransform: "none" }}
          autoFocus
        >
          確認領養
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PetConfirmDialog