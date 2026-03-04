import React, { memo, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { HeaderLeft, HeaderRight, HeaderWrapper, UserMenu } from './style'
import headerTitle from '@/assets/data/header-title.json'
import { Avatar, Dropdown, Input, message } from 'antd'
import type { MenuProps } from 'antd'
import Login from '@/views/login'
import { useUser } from '@/context/user-context'
interface IProps {
  children?: ReactNode
}

const AppHeader: FC<IProps> = () => {
  /*   const [currentIndex, setCurrentIndex] = useState(0) */
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, setUser } = useUser()
  const navigate = useNavigate()

  function showItem(item: any) {
    if (item.type === 'path') {
      return (
        <NavLink
          to={item.link}
          className={({ isActive }) => {
            return isActive ? 'active' : undefined
          }}
        >
          {item.title}
          <i className="icon sprite_01"></i>
        </NavLink>
      )
    } else {
      return (
        <a href={item.link} rel="noreferrer" target="_blank">
          {item.title}
        </a>
      )
    }
  }
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    message.success('已退出登录')
  }
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: '个人主页',
      icon: <UserOutlined />,
      onClick: () => navigate('/personal')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ]
  return (
    <>
      <HeaderWrapper>
        <div className="content wrap-v1">
          <HeaderLeft>
            <a className="logo sprite_01" href="/">
              极光音乐
            </a>
            <div className="title-list">
              {headerTitle.map((item) => {
                return (
                  <div className="item active" key={item.title}>
                    {showItem(item)}
                  </div>
                )
              })}
            </div>
          </HeaderLeft>
          <HeaderRight>
            <Input
              className="search"
              placeholder="音乐/视频/电台/用户"
              prefix={<SearchOutlined />}
            />
            <span className="center">创作者中心</span>
            {user ? (
              // 已登录状态：显示用户头像和用户名
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <UserMenu className="user-menu">
                  <Avatar
                    size={32}
                    icon={<UserOutlined />}
                    src={user.avatar}
                    style={{ backgroundColor: '#87c4ed' }}
                  />
                  <span className="username">{user.username}</span>
                </UserMenu>
              </Dropdown>
            ) : (
              // 未登录状态：显示登录按钮
              <span
                className="login"
                style={{ cursor: 'pointer' }}
                onClick={() => setShowLoginModal(true)}
              >
                登录
              </span>
            )}
          </HeaderRight>
        </div>
        <div className="divider"></div>
      </HeaderWrapper>
      <Login
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  )
}

export default memo(AppHeader)
