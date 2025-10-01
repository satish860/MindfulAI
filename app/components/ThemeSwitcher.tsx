'use client'

import { useTheme } from '../providers/ThemeProvider'
import { themes, ThemeName } from '@/lib/themes'

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme()

  return (
    <div className="theme-switcher">
      <select
        id="themeSelector"
        value={currentTheme}
        onChange={(e) => setTheme(e.target.value as ThemeName)}
        aria-label="Select color theme"
      >
        {Object.entries(themes).map(([key, theme]) => (
          <option key={key} value={key}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  )
}
