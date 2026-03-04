import { useUser } from '@/context/user-context'
import React, { memo, useEffect, useState, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PersonalWrapper, UserCard } from './style'
import { Avatar, Button, Descriptions, message, Modal, Form, Input } from 'antd'
import {
  CalendarOutlined,
  EditOutlined,
  MailOutlined,
  UserOutlined,
  CameraOutlined
} from '@ant-design/icons'

interface IProps {
  children?: ReactNode
}

interface EditFormData {
  username: string
  email: string
  bio: string
}

const Personal: FC<IProps> = () => {
  const { user, setUser } = useUser()
  const navigate = useNavigate()
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [avatarModalVisible, setAvatarModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [userBio, setUserBio] = useState('这个人很懒，什么都没有写～')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleAvatarClick = () => {
    setAvatarModalVisible(true)
  }

  const handleAvatarUpload = async (file: File) => {
    try {
      if (!user) {
        message.error('用户未登录')
        return
      }
      const previewUrl = URL.createObjectURL(file)
      const updatedUserWithPreview = {
        ...user,
        avatar: previewUrl
      }
      setUser(updatedUserWithPreview)
      const formData = new FormData()
      formData.append('avatar', file)
      formData.append('userId', user.id.toString())

      const response = await fetch('http://localhost:3001/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      if (result.success) {
        const fullAvatarUrl = `http://localhost:3001${result.avatarUrl}`
        const updatedUserWithPermanentUrl = {
          ...user,
          avatar: fullAvatarUrl
        }
        setUser(updatedUserWithPermanentUrl)
        localStorage.setItem(
          'user',
          JSON.stringify(updatedUserWithPermanentUrl)
        )
        URL.revokeObjectURL(previewUrl)

        message.success('头像更新成功！')
        setAvatarModalVisible(false)
      } else {
        message.error(result.message || '头像上传失败')
      }
    } catch (error) {
      console.error('上传头像错误:', error)
      message.error('头像上传失败，请检查网络连接')
    }
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        message.error('请选择图片文件')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        message.error('图片大小不能超过5MB')
        return
      }

      handleAvatarUpload(file)
    }

    if (event.target) {
      event.target.value = ''
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleEditProfile = () => {
    setEditModalVisible(true)
    form.setFieldsValue({
      username: user?.username,
      email: user?.email,
      bio: userBio
    })
  }

  const handleEditSubmit = async (values: EditFormData) => {
    console.log('编辑表单数据:', values)

    try {
      if (user) {
        const updatedUser = {
          ...user,
          username: values.username,
          email: values.email
        }
        setUser(updatedUser)
        setUserBio(values.bio)
      }
      try {
        const response = await fetch(
          `http://localhost:3001/api/user/update/${user?.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          }
        )

        const result = await response.json()

        if (result.success) {
          message.success('资料更新成功！')
        } else {
          message.warning('资料已保存（本地）')
        }
      } catch (apiError) {
        message.success('资料已保存（本地）')
      }

      setEditModalVisible(false)
    } catch (error) {
      console.error('更新用户信息错误:', error)
      message.error('更新失败，请检查网络连接')
      setEditModalVisible(false)
    }
  }
  useEffect(() => {
    if (!user) {
      message.warning('请先登录')
      navigate('/')
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const userStats = {
    favorites: 23,
    playlists: 5,
    followers: 128
  }

  return (
    <PersonalWrapper>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <UserCard
        title="个人中心"
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={handleEditProfile}
          >
            编辑资料
          </Button>
        }
      >
        <div className="user-header">
          <div
            className="avatar-section"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              justifyContent: 'flex-start'
            }}
          >
            <div
              style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'inline-block'
              }}
              onClick={handleAvatarClick}
              title="点击更换头像"
            >
              <Avatar
                size={100}
                icon={<UserOutlined />}
                src={user.avatar}
                style={{
                  backgroundColor: '#1890ff',
                  border: '3px solid #e8f4ff',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px'
                }}
              >
                <CameraOutlined />
              </div>
            </div>
            <div
              className="user-info"
              style={{
                flex: 1,
                marginLeft: '20px'
              }}
            >
              <div
                className="username"
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  color: '#333'
                }}
              >
                {user.username}
              </div>
              <div
                style={{
                  color: '#666',
                  marginBottom: '12px',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <MailOutlined
                  style={{ marginRight: '10px', fontSize: '18px' }}
                />
                {user.email}
              </div>
              <div
                style={{
                  color: '#999',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <CalendarOutlined
                  style={{ marginRight: '6px', fontSize: '14px' }}
                />
                注册时间: {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
        <div
          className="user-stats"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            marginTop: '30px',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '1px solid #e9ecef'
          }}
        >
          <div
            className="stat-item"
            style={{
              textAlign: 'center',
              padding: '10px'
            }}
          >
            <div
              className="stat-number"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1890ff'
              }}
            >
              {userStats.favorites}
            </div>
            <div
              className="stat-label"
              style={{
                fontSize: '14px',
                color: '#666',
                marginTop: '4px'
              }}
            >
              收藏歌曲
            </div>
          </div>
          <div
            className="stat-item"
            style={{
              textAlign: 'center',
              padding: '10px'
            }}
          >
            <div
              className="stat-number"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#52c41a'
              }}
            >
              {userStats.playlists}
            </div>
            <div
              className="stat-label"
              style={{
                fontSize: '14px',
                color: '#666',
                marginTop: '4px'
              }}
            >
              创建歌单
            </div>
          </div>
          <div
            className="stat-item"
            style={{
              textAlign: 'center',
              padding: '10px'
            }}
          >
            <div
              className="stat-number"
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#faad14'
              }}
            >
              {userStats.followers}
            </div>
            <div
              className="stat-label"
              style={{
                fontSize: '14px',
                color: '#666',
                marginTop: '4px'
              }}
            >
              粉丝
            </div>
          </div>
        </div>
        <Descriptions
          title="详细信息"
          bordered
          column={1}
          style={{
            marginTop: '30px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
          labelStyle={{
            fontWeight: '600',
            backgroundColor: '#fafafa'
          }}
          contentStyle={{
            backgroundColor: 'white'
          }}
        >
          <Descriptions.Item label="用户ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{user.email}</Descriptions.Item>
          <Descriptions.Item label="个人简介">{userBio}</Descriptions.Item>
        </Descriptions>
      </UserCard>
      <Modal
        title="更换头像"
        open={avatarModalVisible}
        onCancel={() => setAvatarModalVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user.avatar}
              style={{
                backgroundColor: '#1890ff',
                border: '4px solid #e8f4ff',
                marginBottom: '16px'
              }}
            />
            <div style={{ color: '#666', fontSize: '14px' }}>当前头像预览</div>
          </div>

          <Button
            type="primary"
            size="large"
            icon={<CameraOutlined />}
            onClick={triggerFileInput}
            style={{ marginBottom: '12px' }}
          >
            选择图片
          </Button>

          <div style={{ color: '#999', fontSize: '12px' }}>
            支持 JPG、PNG 格式，大小不超过 5MB
          </div>
        </div>
      </Modal>
      <Modal
        title="编辑资料"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 2, message: '用户名至少2个字符' },
              { max: 20, message: '用户名最多20个字符' }
            ]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="个人简介"
            name="bio"
            rules={[{ max: 200, message: '个人简介最多200个字符' }]}
          >
            <Input.TextArea
              placeholder="请输入个人简介"
              rows={4}
              showCount
              maxLength={200}
            />
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button
              onClick={() => setEditModalVisible(false)}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </PersonalWrapper>
  )
}

export default memo(Personal)
