export type ThemeName = 'current' | 'earth' | 'water' | 'stone' | 'tea' | 'sakura' | 'moss'

export interface Theme {
  name: string
  colors: {
    bgPrimary: string
    textPrimary: string
    textSecondary: string
    accentSage: string
    accentLight: string
    borderLight: string
    shadowSoft: string
  }
}

export const themes: Record<ThemeName, Theme> = {
  current: {
    name: 'Current Theme',
    colors: {
      bgPrimary: '#FAFAF8',
      textPrimary: '#2C3E50',
      textSecondary: '#5A6C7D',
      accentSage: '#7C9885',
      accentLight: '#A8BFA8',
      borderLight: '#E8E8E8',
      shadowSoft: 'rgba(44, 62, 80, 0.08)',
    },
  },
  earth: {
    name: 'Earth Tones',
    colors: {
      bgPrimary: '#F5F3EE',
      textPrimary: '#3D3935',
      textSecondary: '#7C756D',
      accentSage: '#9B8B7E',
      accentLight: '#C4B8A9',
      borderLight: '#E6E1D8',
      shadowSoft: 'rgba(61, 57, 53, 0.08)',
    },
  },
  water: {
    name: 'Muted Blues',
    colors: {
      bgPrimary: '#F8F9FA',
      textPrimary: '#2E3E4E',
      textSecondary: '#5F6F7F',
      accentSage: '#6B8E9E',
      accentLight: '#9FB8C3',
      borderLight: '#E7ECEF',
      shadowSoft: 'rgba(46, 62, 78, 0.08)',
    },
  },
  stone: {
    name: 'Stone Garden',
    colors: {
      bgPrimary: '#FAFAFA',
      textPrimary: '#2A2A2A',
      textSecondary: '#5C5C5C',
      accentSage: '#7A7A7A',
      accentLight: '#A8A8A8',
      borderLight: '#E5E5E5',
      shadowSoft: 'rgba(42, 42, 42, 0.08)',
    },
  },
  tea: {
    name: 'Tea Ceremony',
    colors: {
      bgPrimary: '#FAF7F2',
      textPrimary: '#3A3530',
      textSecondary: '#6B6358',
      accentSage: '#8B7E6A',
      accentLight: '#B8AB96',
      borderLight: '#E9E4DC',
      shadowSoft: 'rgba(58, 53, 48, 0.08)',
    },
  },
  sakura: {
    name: 'Cherry Blossom',
    colors: {
      bgPrimary: '#FBF9F7',
      textPrimary: '#2D3436',
      textSecondary: '#636E72',
      accentSage: '#C9A5A0',
      accentLight: '#E3CCC8',
      borderLight: '#EFEAE7',
      shadowSoft: 'rgba(45, 52, 54, 0.08)',
    },
  },
  moss: {
    name: 'Moss & Stone',
    colors: {
      bgPrimary: '#F7F7F5',
      textPrimary: '#2C3E50',
      textSecondary: '#5A6C7D',
      accentSage: '#6B8270',
      accentLight: '#9CAA9A',
      borderLight: '#E5E7E3',
      shadowSoft: 'rgba(44, 62, 80, 0.08)',
    },
  },
}

export function getTimeBasedTheme(): ThemeName {
  const hour = new Date().getHours()

  if (hour >= 6 && hour < 12) {
    return 'tea' // Morning: Tea Ceremony
  } else if (hour >= 12 && hour < 18) {
    return 'current' // Afternoon: Current (sage green)
  } else {
    return 'earth' // Evening: Earth Tones
  }
}
