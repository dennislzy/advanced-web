"use client"

import { createTheme, alpha } from "@mui/material/styles"


const lightPalette = {
  primary: {
    main: "#E89B5F", // oklch(0.65 0.19 35) 溫暖的橘色
    light: "#F5B886",
    dark: "#D87E3E",
    contrastText: "#FCFAF5", // oklch(0.99 0.01 85)
  },
  secondary: {
    main: "#7AA8D9", // oklch(0.68 0.15 220) 柔和的藍色
    light: "#A3C4E8",
    dark: "#5A8CC2",
    contrastText: "#FCFAF5",
  },
  background: {
    default: "#FCFAF5", // oklch(0.99 0.01 85)
    paper: "#FFFFFF", // oklch(1 0 0)
  },
  text: {
    primary: "#3D3840", // oklch(0.25 0.02 280)
    secondary: "#8B8690", // oklch(0.55 0.02 280)
  },
  divider: "#E8E4E1", // oklch(0.92 0.01 85)
  action: {
    hover: alpha("#E8E4E1", 0.08),
    selected: alpha("#E8E4E1", 0.12),
  },
}

const darkPalette = {
  primary: {
    main: "#F0A36B", // oklch(0.7 0.19 35)
    light: "#F5B886",
    dark: "#E89B5F",
    contrastText: "#26242A", // oklch(0.15 0.02 280)
  },
  secondary: {
    main: "#89B5E0", // oklch(0.72 0.15 220)
    light: "#A3C4E8",
    dark: "#7AA8D9",
    contrastText: "#26242A",
  },
  background: {
    default: "#26242A", // oklch(0.15 0.02 280)
    paper: "#2E2B33", // oklch(0.18 0.02 280)
  },
  text: {
    primary: "#FAF8F5", // oklch(0.98 0.01 85)
    secondary: "#A6A0AB", // oklch(0.65 0.02 280)
  },
  divider: "#3F3C45", // oklch(0.25 0.02 280)
  action: {
    hover: alpha("#3F3C45", 0.08),
    selected: alpha("#3F3C45", 0.12),
  },
}

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    ...lightPalette,
  },
  shape: {
    borderRadius: 12, // var(--radius): 0.75rem
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h1: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.75,
    },
    body2: {
      lineHeight: 1.75,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 12,
        },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    ...darkPalette,
  },
  shape: {
    borderRadius: 12,
  },
  typography: lightTheme.typography,
  components: lightTheme.components,
})