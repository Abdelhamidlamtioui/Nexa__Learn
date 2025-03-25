"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDocumentation: boolean
  setIsDocumentation: (isDocs: boolean) => void
}

const initialState: ThemeContextType = {
  theme: "system",
  setTheme: () => null,
  toggleTheme: () => null,
  isDocumentation: false,
  setIsDocumentation: () => null,
}

const ThemeContext = createContext<ThemeContextType>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "doctech-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [isDocumentation, setIsDocumentation] = useState<boolean>(false)

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      setTheme(stored as Theme)
    } else {
      // Set dark as default for documentation pages
      if (window.location.pathname.includes("/documentation")) {
        setTheme("dark")
        localStorage.setItem(storageKey, "dark")
        setIsDocumentation(true)
      }
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    
    root.classList.remove("light", "dark")
    
    // Allow light mode even in documentation - remove the forced dark mode
    if (theme === "dark") {
      root.classList.add("dark")
      localStorage.setItem(storageKey, "dark")
    } else if (theme === "light") {
      root.classList.add("light")
      localStorage.setItem(storageKey, "light")
    } else {
      // Handle system preference
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemPreference)
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDocumentation,
    setIsDocumentation,
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

