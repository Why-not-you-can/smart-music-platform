import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HeaderWrapper } from './style'

interface IProps {
  children?: ReactNode
  title: any
  rightSlot?: ReactNode
}

const ThemeHeaderNormal: FC<IProps> = (props) => {
  const { title, rightSlot } = props

  return (
    <HeaderWrapper>
      <div className="title">{title}</div>
      {rightSlot && <div className="right">{rightSlot}</div>}
    </HeaderWrapper>
  )
}

export default memo(ThemeHeaderNormal)
