import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { LoginWrapper } from './style'
import { Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useUser } from '@/context/user-context'

interface IProps {
  children?: ReactNode
}

const UserLogin: FC<IProps> = () => {
  const { user } = useUser() as any
  if (user) {
    return (
      <LoginWrapper className="sprite_02 logged-in">
        <Avatar
          className="avatar"
          shape="square"
          icon={<UserOutlined />}
          src={user.avatar}
        />

        <div className="info">
          <div className="username">{user.username}</div>
          <div className="stats">
            <span>笔记：{user.noteCount ?? 0}</span>
            <span>粉丝：{user.fansCount ?? 0}</span>
          </div>
        </div>
      </LoginWrapper>
    )
  }

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
