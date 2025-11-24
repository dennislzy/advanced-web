"use client";

import Link from "next/link";
import { useState, useEffect, MouseEvent } from "react";
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
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PetsIcon from "@mui/icons-material/Pets";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase.client";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  // ✅ 追蹤目前登入使用者
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const navItems = [
    {
    name: "AI寵物諮詢",
    href: "https://gemini.google.com/gem/1iQFA-1G23_Mg8E7-J8yi72p5uCf0oy6I?usp=sharing", 
  },
    { name: "寵物詳細資訊", href: "/pet" },
    { name: "領養須知", href: "/pet/petInfo" },
    { name: "我的領養申請", href: "/pet/my-adoptions" },
  ];

  const handleDrawerToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAccountMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAccountMenuAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  const isAccountMenuOpen = Boolean(accountMenuAnchorEl);

  // ✅ 一進來就檢查登入狀態，並且監聽變化
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (!isMounted) return;
        if (error) {
          console.error("取得使用者資訊失敗:", error);
        }
        setCurrentUser(data?.user ?? null);
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setCurrentUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
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
                  <PetsIcon
                    sx={{ color: "primary.contrastText", fontSize: 24 }}
                  />
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

            {/* 桌面版導航 + 帳號選單 */}
            {!isMobile && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  ml: "auto",
                  alignItems: "center",
                }}
              >
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

                {/* 帳號下拉按鈕 */}
                <Button
                  onClick={handleAccountMenuOpen}
                  startIcon={<AccountCircleIcon sx={{ fontSize: 20 }} />}
                  sx={{
                    ml: 1,
                    color: "text.primary",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    textTransform: "none",
                    backgroundColor: "action.hover",
                    "&:hover": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  {authLoading
                    ? "載入中..."
                    : currentUser
                    ? "會員中心（已登入）"
                    : "會員中心"}
                </Button>

                {/* ✅ 下拉選單：未登入 => 登入 / 註冊；已登入 => 登出 */}
                <Menu
                  anchorEl={accountMenuAnchorEl}
                  open={isAccountMenuOpen}
                  onClose={handleAccountMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  {currentUser ? (
                    <MenuItem
                      component={Link}
                      href="/logout" // ✅ 導向登出頁：app/logout/page.tsx
                      onClick={handleAccountMenuClose}
                    >
                      登出
                    </MenuItem>
                  ) : (
                    [
                      <MenuItem
                        key="login"
                        component={Link}
                        href="/L" // 登入頁：app/L/page.tsx
                        onClick={handleAccountMenuClose}
                      >
                        登入
                      </MenuItem>,
                      <MenuItem
                        key="signup"
                        component={Link}
                        href="/signup" // 註冊頁
                        onClick={handleAccountMenuClose}
                      >
                        註冊
                      </MenuItem>,
                    ]
                  )}
                </Menu>
              </Box>
            )}

            {/* 手機版漢堡選單按鈕 */}
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

      {/* 手機版側邊欄 */}
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
              {authLoading
                ? "會員中心（載入中）"
                : currentUser
                ? "會員中心（已登入）"
                : "會員中心"}
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

            {/* ✅ 手機版：依登入狀態切換登入 / 登出 + 註冊 */}
            {currentUser ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/logout"
                    onClick={handleDrawerToggle}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    <ListItemText
                      primary="登出"
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/L"
                    onClick={handleDrawerToggle}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    <ListItemText
                      primary="登入"
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href="/signup"
                    onClick={handleDrawerToggle}
                    sx={{ py: 1.5, px: 3 }}
                  >
                    <ListItemText
                      primary="註冊"
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: 500,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
