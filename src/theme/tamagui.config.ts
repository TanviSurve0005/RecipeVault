import { createTamagui } from '@tamagui/core'
import { config } from '@tamagui/config/v2'

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    light: {
      bg: '#fff',
      text: '#000',
      primary: 'blue',
    },
    dark: {
      bg: '#000',
      text: '#fff',
      primary: 'lightblue',
    }
  }
})

export type Conf = typeof tamaguiConfig
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig