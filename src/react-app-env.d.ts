/// <reference types="react-scripts" />
import 'styled-components'
declare module 'styled-components' {
  interface DefaultTheme {
    mixin: { wrapv1: string }
  }
}
