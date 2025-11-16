'use client'
import { AuthRoute } from "@/authRoute"
import { Footer } from "@/component/footer/footer"
import { Header } from "@/component/header/header"
import { Box, Container } from "@mui/material"

export default function PetLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
        <Header/>
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 6 }}>
            <Container maxWidth="lg" >
              <AuthRoute>
                 {children}
              </AuthRoute>
            </Container>
        </Box>
        <Footer/>
    </>
  )
}