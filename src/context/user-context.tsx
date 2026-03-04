// src/context/user-context.tsx
import React, { createContext, useState, useEffect, useContext } from 'react'

export interface UserType {
  id: number
  username: string
  email: string
  avatar?: string
}

interface UserContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
}

// 创建上下文
export const UserContext = createContext<UserContextType | undefined>(undefined)

// 创建 Provider 组件
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, _setUser] = useState<UserType | null>(null)

  // 包装 setUser 函数以添加调试
  const setUser = (newUser: UserType | null) => {
    _setUser(newUser)
  }

  // 初始化时从本地存储读取用户信息
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem('user')
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
    <UserContext.Provider value={{ user, setUser }}>
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
