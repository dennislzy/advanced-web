"use client"

import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { lightTheme, darkTheme } from "@/theme/theme"
import { useState, createContext, useContext, ReactNode } from "react"

type ThemeMode = "light" | "dark"

interface ThemeContextType {
  mode: ThemeMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
})

export const useThemeMode = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light")

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  const theme = mode === "light" ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}