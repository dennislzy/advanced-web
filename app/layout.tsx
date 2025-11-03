import { ThemeProvider } from "@/component/theme-provider"
import { AccountProvider } from "@/context/AccountContext"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "寵物之家 - Pet Paradise",
  description: "為每一位毛孩提供最溫暖的家",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <AccountProvider>
            {children}
          </AccountProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}