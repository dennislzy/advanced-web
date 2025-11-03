"use client"

import Link from "next/link"
import { useState } from "react"
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import PetsIcon from "@mui/icons-material/Pets"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { useAccount } from "@/context/AccountContext"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { account } = useAccount()

  const navItems = [
    { name: "寵物詳細資訊", href: "/pet" },
    { name: "領養須知", href: "/pet/petInfo" },
    { name: "我的領養申請", href: "/pet/my-adoptions" },
  ]

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Logo 和標題 */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "opacity 0.3s",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    backgroundColor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PetsIcon sx={{ color: "primary.contrastText", fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: "text.primary",
                    }}
                  >
                    寵物之家
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                    }}
                  >
                    Pet Paradise
                  </Typography>
                </Box>
              </Box>
            </Link>

            {/* 桌面導航 */}
            {!isMobile && (
              <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    component={Link}
                    href={item.href}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                  >
                    {item.name}
                  </Button>
                ))}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                >
                  <AccountCircleIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Typography
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                    }}
                  >
                    {account}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* 移動端菜單按鈕 */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="打開選單"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: "auto", color: "text.primary" }}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 移動端側邊欄 */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
          },
        }}
      >
        <Box sx={{ pt: 2 }}>
          {/* 帳號資訊 */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 3,
              py: 2,
              mb: 1,
              backgroundColor: "action.hover",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <AccountCircleIcon sx={{ color: "primary.main", fontSize: 28 }} />
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {account}
            </Typography>
          </Box>

          <List>
            {navItems.map((item) => (
              <ListItem key={item.name} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={handleDrawerToggle}
                  sx={{
                    py: 1.5,
                    px: 3,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  )
}