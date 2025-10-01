'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ThemeName, themes, getTimeBasedTheme } from '@/lib/themes'

interface ThemeContextType {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>('current')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('selectedTheme') as ThemeName | null

    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Use time-based theme if no saved preference
      const timeTheme = getTimeBasedTheme()
      setCurrentTheme(timeTheme)
      applyTheme(timeTheme)
    }
  }, [])

  const applyTheme = (themeName: ThemeName) => {
    const theme = themes[themeName]
    const root = document.documentElement

    root.style.setProperty('--bg-primary', theme.colors.bgPrimary)
    root.style.setProperty('--text-primary', theme.colors.textPrimary)
    root.style.setProperty('--text-secondary', theme.colors.textSecondary)
    root.style.setProperty('--accent-sage', theme.colors.accentSage)
    root.style.setProperty('--accent-light', theme.colors.accentLight)
    root.style.setProperty('--border-light', theme.colors.borderLight)
    root.style.setProperty('--shadow-soft', theme.colors.shadowSoft)
  }

  const setTheme = (themeName: ThemeName) => {
    setCurrentTheme(themeName)
    applyTheme(themeName)
    localStorage.setItem('selectedTheme', themeName)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
