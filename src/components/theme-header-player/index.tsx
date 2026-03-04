import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { ThemeHeaderPlayerWrapper } from './style'

interface IProps {
  children?: ReactNode
  title: any
}

const ThemeHeaderPlayer: FC<IProps> = (porps) => {
  const { title } = porps
  return (
    <ThemeHeaderPlayerWrapper>
      <h3>{title}</h3>
    </ThemeHeaderPlayerWrapper>
  )
}

export default memo(ThemeHeaderPlayer)
