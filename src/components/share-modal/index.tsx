import React, { memo, useState, useEffect } from 'react'
import type { FC, ReactNode } from 'react'
import { Modal, Button, Input, message } from 'antd'
import {
  CopyOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined
} from '@ant-design/icons'
// 引入样式容器
import { ShareContentWrapper } from './style'

export interface ShareConfig {
  title: string
  content: string
  url: string
}

interface IProps {
  children?: ReactNode
  visible: boolean
  onClose: () => void
  config?: ShareConfig
  onShareSuccess?: () => void
}

const ShareModel: FC<IProps> = ({
  visible,
  onClose,
  config,
  onShareSuccess
}) => {
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    if (config) {
      setShareMessage(config.content)
    }
  }, [config])

  const handleCopyLink = () => {
    if (!config) return

    navigator.clipboard
      .writeText(config.url)
      .then(() => {
        message.success('分享链接已复制到剪贴板')
        onShareSuccess?.()
      })
      .catch(() => {
        const textArea = document.createElement('textarea')
        textArea.value = config.url
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        message.success('分享链接已复制到剪贴板')
        onShareSuccess?.()
      })
  }

  const handleSocialShare = (platform: string) => {
    if (!config) return

    const shareText = encodeURIComponent(shareMessage)
    const shareLink = encodeURIComponent(config.url)

    let shareUrl = ''
    switch (platform) {
      case 'wechat':
        shareUrl = `weixin://dl/chat?text=${shareText} ${shareLink}`
        message.info('请在弹出的微信中分享给朋友')
        break
      case 'qq':
        shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${shareLink}&title=${shareText}`
        break
      case 'weibo':
        shareUrl = `http://service.weibo.com/share/share.php?url=${shareLink}&title=${shareText}`
        break
      default:
        return
    }

    window.open(shareUrl, '_blank', 'width=600,height=400')
    onShareSuccess?.()
  }

  return (
    <Modal
      title="分享"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          取消
        </Button>,
        <Button
          key="copy"
          type="primary"
          icon={<CopyOutlined />}
          onClick={handleCopyLink}
        >
          复制链接
        </Button>
      ]}
    >
      <ShareContentWrapper>
        {config && (
          <div>
            <div className="share-info">
              <strong>分享内容:</strong> {config.title}
            </div>

            <Input.TextArea
              className="share-textarea"
              rows={3}
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="输入分享消息..."
            />

            <div className="share-platform-title">
              <strong>分享到:</strong>
            </div>

            <div className="share-platform-buttons">
              <Button
                className="wechat-btn"
                icon={<WechatOutlined />}
                onClick={() => handleSocialShare('wechat')}
              >
                微信
              </Button>
              <Button
                className="qq-btn"
                icon={<QqOutlined />}
                onClick={() => handleSocialShare('qq')}
              >
                QQ
              </Button>
              <Button
                className="weibo-btn"
                icon={<WeiboOutlined />}
                onClick={() => handleSocialShare('weibo')}
              >
                微博
              </Button>
            </div>

            <div className="share-link-section">
              <strong>链接:</strong>
              <div className="share-link-box">{config.url}</div>
            </div>
          </div>
        )}
      </ShareContentWrapper>
    </Modal>
  )
}

export default memo(ShareModel)
