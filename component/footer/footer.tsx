import Link from "next/link"
import Box from "@mui/material/Box"
import Container from "@mui/material/Container"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Divider from "@mui/material/Divider"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import TwitterIcon from "@mui/icons-material/Twitter"
import EmailIcon from "@mui/icons-material/Email"
import PetsIcon from "@mui/icons-material/Pets"

export function Footer() {
  const footerLinks = {
    關於我們: [
      { name: "公司簡介", href: "/about" },
      { name: "團隊介紹", href: "/team" },
      { name: "聯絡我們", href: "/contact" },
    ],
    服務項目: [
      { name: "寵物領養", href: "/adoption" },
      { name: "寵物照護", href: "/care" },
      { name: "寵物訓練", href: "/training" },
    ],
    資源中心: [
      { name: "寵物知識", href: "/knowledge" },
      { name: "常見問題", href: "/faq" },
      { name: "部落格", href: "/blog" },
    ],
  }

  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "#" },
    { name: "Instagram", icon: InstagramIcon, href: "#" },
    { name: "Twitter", icon: TwitterIcon, href: "#" },
    { name: "Email", icon: EmailIcon, href: "mailto:info@petparadise.com" },
  ]

  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", bgcolor: "background.paper", py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo 和描述 */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  bgcolor: "primary.main",
                }}
              >
                <PetsIcon sx={{ color: "primary.contrastText" }} />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
                寵物之家
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
              為您的寵物提供最優質的照護服務，讓每一個毛孩都能擁有幸福快樂的生活。
            </Typography>
            {/* 社交媒體連結 */}
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <IconButton
                    key={social.name}
                    component={Link}
                    href={social.href}
                    size="small"
                    sx={{
                      bgcolor: "action.hover",
                      "&:hover": {
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                      },
                    }}
                    aria-label={social.name}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                )
              })}
            </Box>
          </Grid>

          {/* 連結欄位 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item key={category} xs={12} sm={4} md={6} lg={3}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                {category}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1.5 }}>
                    <Link href={link.href} style={{ textDecoration: "none" }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          "&:hover": {
                            color: "primary.main",
                          },
                        }}
                      >
                        {link.name}
                      </Typography>
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* 版權資訊 */}
        <Divider sx={{ my: 4 }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} 寵物之家 Pet Paradise. 版權所有。
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link href="/privacy" style={{ textDecoration: "none" }}>
              <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                隱私政策
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: "none" }}>
              <Typography variant="body2" color="text.secondary" sx={{ "&:hover": { color: "primary.main" } }}>
                服務條款
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
