import React, { memo, useState, createContext } from 'react'
import type { FC, ReactNode } from 'react'
import {
  ActionGroup,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalWrapper
} from './style'
import {
  CloseOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Button, Input, message, Typography } from 'antd'
import { useUser } from '@/context/user-context'
const { Text } = Typography
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

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {
    console.log()
  }
})

interface IProps {
  children?: ReactNode
  visible: boolean
  onClose: () => void
}

const Login: FC<IProps> = ({ visible, onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const { setUser } = useUser()

  if (!visible) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    setErrorMsg('')
  }

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = formData

    // 前端验证
    if (!username || !email || !password || !confirmPassword) {
      message.error('请填写所有字段')
      return
    }

    if (password !== confirmPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    if (password.length < 6) {
      message.error('密码长度至少6位')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      message.error('请输入有效的邮箱地址')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        message.success('注册成功！')
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        setIsLogin(true)
        setErrorMsg('')
      } else {
        setErrorMsg(result.message)
      }
    } catch (error) {
      message.error('注册失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    const { username, password } = formData

    if (!username || !password) {
      setErrorMsg('请填写用户名和密码')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const result = await response.json()

      if (result.success) {
        message.success('登录成功！')
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
        setUser(result.user)
        setErrorMsg('')
        handleClose()
      } else {
        setErrorMsg('账号或密码错误，请重新输入或找回密码')
        setFormData((pre) => ({ ...pre, password: '' }))
      }
    } catch (error) {
      setErrorMsg('登录失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (isLogin) {
      handleLogin()
    } else {
      handleRegister()
    }
  }

  const handleRegisterClick = () => {
    setIsLogin(false)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrorMsg('')
  }

  const handleLoginClick = () => {
    setIsLogin(true)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrorMsg('')
  }

  const handleClose = () => {
    setIsLogin(true)
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    setErrorMsg('')
    onClose()
  }
  return (
    <ModalWrapper className={visible ? 'visible' : ''}>
      <div className="mask" onClick={handleClose} aria-label="关闭弹窗"></div>
      <div className="modal">
        <ModalHeader>
          <h3 className="title">{isLogin ? '账号登录' : '注册账号'}</h3>
          <CloseOutlined
            className="close-btn"
            onClick={handleClose}
            aria-label="关闭"
          />
        </ModalHeader>
        {errorMsg && (
          <div style={{ padding: '0 24px 16px' }}>
            <Text type="danger" strong>
              {errorMsg}
            </Text>
          </div>
        )}
        <ModalBody>
          {isLogin ? (
            <>
              <div className="form-item">
                <Input
                  placeholder="用户名/邮箱"
                  size="large"
                  prefix={<UserOutlined className="input-icon" />}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  aria-label="请输入用户名或邮箱"
                />
              </div>
              <div className="form-item">
                <Input.Password
                  placeholder="密码"
                  size="large"
                  prefix={<LockOutlined className="input-icon" />}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  aria-label="请输入密码"
                />
              </div>
              <div className="form-options">
                <label className="remember-checkbox">
                  <input type="checkbox" />
                  <span className="label-text">记住我</span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="form-item">
                <Input
                  placeholder="请输入用户名"
                  size="large"
                  prefix={<UserOutlined className="input-icon" />}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  aria-label="请输入用户名"
                />
              </div>
              <div className="form-item">
                <Input
                  placeholder="请输入邮箱"
                  size="large"
                  prefix={<MailOutlined className="input-icon" />}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  aria-label="请输入邮箱"
                />
              </div>
              <div className="form-item">
                <Input.Password
                  placeholder="请设置密码"
                  size="large"
                  prefix={<LockOutlined className="input-icon" />}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange('password', e.target.value)
                  }
                  aria-label="请设置密码"
                />
              </div>
              <div className="form-item">
                <Input.Password
                  placeholder="请确认密码"
                  size="large"
                  prefix={<LockOutlined className="input-icon" />}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange('confirmPassword', e.target.value)
                  }
                  aria-label="请确认密码"
                />
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="login-button"
            size="large"
            type="primary"
            block
            loading={loading}
            onClick={handleSubmit}
          >
            {isLogin ? '立即登录' : '立即注册'}
          </Button>
        </ModalFooter>
        <ActionGroup>
          {isLogin ? (
            <>
              <a className="register-btn" onClick={handleRegisterClick}>
                注册账号
              </a>
              <a
                href="#"
                className="forgot-link"
                onClick={(e) => e.stopPropagation()}
              >
                忘记密码？
              </a>
            </>
          ) : (
            <>
              <span className="register-tip">已有账号？</span>
              <a className="login-link" onClick={handleLoginClick}>
                立即登录
              </a>
            </>
          )}
        </ActionGroup>
      </div>
    </ModalWrapper>
  )
}

export default memo(Login)
