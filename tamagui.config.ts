import { createTamagui } from 'tamagui'

const config = createTamagui({
  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
      gray1: '#f8f9fa',
      gray2: '#e9ecef',
      gray3: '#dee2e6',
      gray4: '#ced4da',
      gray5: '#adb5bd',
      gray6: '#6c757d',
      gray7: '#495057',
      gray8: '#343a40',
      gray9: '#212529',
      gray10: '#1a1d21',
      gray11: '#14171a',
      gray12: '#0e1013',
      blue1: '#cfe2ff',
      blue2: '#9ec5fe',
      blue3: '#6ea8fe',
      blue4: '#3d8bfd',
      blue5: '#0d6efd',
      blue6: '#0a58ca',
      blue7: '#084298',
      blue8: '#052c65',
      blue9: '#031633',
      blue10: '#021027',
      red9: '#dc3545',
      red10: '#bd2130',
    },
    dark: {
      // Add similar dark theme values
      background: '#000000',
      color: '#ffffff',
      // ... other dark theme colors
    },
  },
  tokens: {
    color: {
      // Include all color tokens from the theme
      white: '#fff',
      black: '#000',
      gray1: '#f8f9fa',
      gray2: '#e9ecef',
      // ... all other colors
    },
    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      true: 4,
    },
    size: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      9: 36,
      10: 40,
      true: 4,
    },
    radius: {
      0: 0,
      1: 3,
      2: 6,
      3: 9,
      4: 12,
      5: 15,
      6: 20,
      7: 25,
      8: 30,
      9: 35,
      10: 40,
      true: 3,
    },
    zIndex: {
      0: 0,
      1: 100,
      2: 200,
      3: 300,
      4: 400,
      5: 500,
      true: 100,
    },
  },
  fonts: {
    body: {
      family: 'System',
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 40,
        true: 16,
      },
      lineHeight: {
        1: 16,
        2: 20,
        3: 24,
        4: 28,
        5: 32,
        6: 36,
        7: 40,
        8: 44,
        9: 48,
        10: 52,
        true: 24,
      },
      weight: {
        1: '400',
        2: '500',
        3: '600',
        4: '700',
        5: '800',
        6: '900',
        true: '400',
      },
      letterSpacing: {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        true: 0,
      },
    },
  },
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config