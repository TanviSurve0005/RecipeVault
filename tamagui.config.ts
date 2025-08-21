import { createTamagui, createFont } from '@tamagui/core';

// Create a font configuration with trendy sizes
const defaultFont = createFont({
  family: 'System, -apple-system, Roboto, Helvetica, Arial, sans-serif',
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
    12: 48, // Larger for bold headings
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
    bold: '700',
    true: '400',
  },
});

const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    body: defaultFont,
    heading: defaultFont,
  },
  themes: {
    light: {
      background: '#FFFFFF',
      color: '#212121',
      teal: '#26A69A',
      purple: '#AB47BC',
      gradientStart: '#26A69A',
      gradientEnd: '#AB47BC',
      gray1: '#F5F5F5',
      gray3: '#E0E0E0',
      gray8: '#757575',
      border: '#E0E0E0',
    },
    dark: {
      background: '#121212',
      color: '#FFFFFF',
      teal: '#26A69A',
      purple: '#AB47BC',
      gradientStart: '#1E7D74',
      gradientEnd: '#8E24AA',
      gray1: '#333333',
      gray3: '#424242',
      gray8: '#B0BEC5',
      border: '#424242',
    },
  },
  tokens: {
    color: {
      white: '#FFFFFF',
      black: '#000000',
      teal: '$teal',
      purple: '$purple',
      gray1: '$gray1',
      gray3: '$gray3',
      gray8: '$gray8',
    },
    space: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      true: 4,
    },
    size: {
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 28,
      8: 32,
      true: 4,
    },
    radius: {
      4: 8,
      5: 10,
      6: 12,
      8: 16,
      true: 8,
    },
    zIndex: {
      1: 100,
      2: 200,
      true: 100,
    },
  },
  
  components: {
    Button: {
      variants: {
        link: {
          backgroundColor: 'transparent',
          borderWidth: 0,
          color: '$purple',
          textDecorationLine: 'underline',
          hoverStyle: { color: '$gradientEnd' },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: '$teal',
          color: '$teal',
          hoverStyle: { backgroundColor: '$gray1' },
        },
      },
    },
    Input: {
      variants: {
        default: {
          backgroundColor: '$gray1',
          shadowColor: '$gray3',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      },
    },
  },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {
    animations: {
      bouncy: { type: 'spring'; damping: number; mass: number; stiffness: number };
      quick: { type: 'timing'; duration: number };
    };
  }
}

export default config;