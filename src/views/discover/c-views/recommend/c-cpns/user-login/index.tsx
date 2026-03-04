import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { LoginWrapper } from './style'

interface IProps {
  children?: ReactNode
}

const UserLogin: FC<IProps> = () => {
  return (
    <LoginWrapper className="sprite_02">
      <p className="desc">登录极光音乐，可以享受无限收藏的乐趣</p>
      <a href="#/login" className="sprite_02">
        用户登录
      </a>
    </LoginWrapper>
  )
}

export default memo(UserLogin)
