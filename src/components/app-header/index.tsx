import React, { memo, useCallback, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { SearchOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { HeaderLeft, HeaderRight, HeaderWrapper, UserMenu } from './style'
import headerTitle from '@/assets/data/header-title.json'
import { Avatar, Dropdown, Input, message } from 'antd'
import type { MenuProps } from 'antd'
import Login from '@/views/login'
import { useUser } from '@/context/user-context'
import SearchDropdown from '../seach-down-list'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  clearSearchResultAction,
  fetchSearchValueAction,
  fetchSongForSearchAction
} from '@/views/search/store/search'
interface IProps {
  children?: ReactNode
}

const AppHeader: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { songList, artistList, albumList } = useAppSelector(
    (state) => state.search
  )
  const [inputValue, setInputValue] = useState('')
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const debounceSearch = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        dispatch(fetchSearchValueAction({ keywords: value, limit: 4 }))
      }, 500)
    },
    [dispatch]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    setDropdownVisible(!!value.trim())
    if (value.trim()) {
      debounceSearch(value)
    } else {
      dispatch(clearSearchResultAction())
    }
  }
  const handleBlur = () => {
    setTimeout(() => setDropdownVisible(false), 200)
  }

  const handleFocus = () => {
    if (inputValue.trim()) setDropdownVisible(true)
  }

  const handleItemClick = (
    type: 'song' | 'artist' | 'album' | 'user',
    id: number
  ) => {
    if (type === 'song') {
      dispatch(fetchSongForSearchAction(id))
      navigate(`/discover/player`)
    }
    setDropdownVisible(false)
  }
  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = inputValue.trim()
    if (!value) return
    navigate(`/search?keywords=${encodeURIComponent(value)}`)
    setDropdownVisible(false)
    // 3. 可选：回车后清空输入框（不需要可以删掉）
    // setInputValue('')
  }

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
              allowClear
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onPressEnter={handleEnterPress}
            />
            {dropdownVisible && (
              <SearchDropdown
                inputValue={inputValue}
                songList={songList.slice(0, 4)}
                artistList={artistList}
                albumList={albumList}
                onItemClick={handleItemClick}
              />
            )}
            <Link to="/mine" className="center">
              创作者中心
            </Link>
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
