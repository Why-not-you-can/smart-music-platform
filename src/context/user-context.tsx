import React, { createContext, useState, useEffect, useContext } from 'react'
import { message } from 'antd'

export interface UserType {
  id: number
  username: string
  email: string
  avatar?: string
}

interface UserContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  logout: () => void
  isTokenValid: () => boolean
}

// 创建上下文
export const UserContext = createContext<UserContextType | undefined>(undefined)

const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

// 创建 Provider 组件
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, _setUser] = useState<UserType | null>(null)

  // 包装 setUser 函数以添加调试
  const setUser = (newUser: UserType | null) => {
    _setUser(newUser)
  }

  // 统一退出登录方法
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    _setUser(null)
    message.success('已退出登录')
  }

  const isTokenValid = () => {
    const token = localStorage.getItem('token')
    if (!token) return false

    const decoded = parseJwt(token)
    if (!decoded || !decoded.exp) return false

    // exp是秒级时间戳，乘以1000转成毫秒
    const expirationTime = decoded.exp * 1000
    const currentTime = Date.now()

    // 如果当前时间大于过期时间，说明token已过期
    return currentTime < expirationTime
  }

  // 初始化时：先检查token是否有效，再恢复用户状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user')

    if (!isTokenValid()) {
      logout()
      return
    }

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        console.error('❌ 解析用户数据失败:', error)
        logout()
      }
    }
  }, [])

  // 用户状态变化时同步到本地存储
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser, logout, isTokenValid }}>
      {children}
    </UserContext.Provider>
  )
}

// 创建自定义 Hook
export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
