// MainCard.tsx
import { Box, Grid, Paper, Typography } from "@mui/material"
import FavoriteIcon from "@mui/icons-material/Favorite"

interface NoticeCardProps {
    title: string
    description: string
    icon: React.ReactNode
}

const MainCard = ({ title, description, icon }: NoticeCardProps) => {
    return (
        <>
        <Grid item xs={12} md={6}>
            <Paper
                sx={{
                p: 3,
                height: "100%",
                textAlign: "left",
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                },
                }}
            >
                <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    opacity: 0.1,
                    mb: 2,
                    position: "relative",
                }}
                >
                <FavoriteIcon
                    sx={{
                    color: "primary.main",
                    fontSize: 24,
                    position: "absolute",
                    opacity: 1,
                    }}
                />
                </Box>

                <Typography
                variant="h6"
                sx={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    mb: 1,
                }}
                >
                {title}
                </Typography>

                <Typography
                variant="body2"
                sx={{
                    fontSize: "0.875rem",
                    lineHeight: 1.75,
                    color: "text.secondary",
                }}
                >
                {description}
                </Typography>
            </Paper>
        </Grid>
        </>
    )
}

export default MainCard