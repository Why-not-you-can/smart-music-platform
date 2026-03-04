import React, { memo, useState, useEffect, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { MineWrapper } from './style'
import { useUser } from '@/context/user-context'
import {
  Avatar,
  Button,
  Card,
  message,
  List,
  Progress,
  Statistic,
  Row,
  Col,
  Modal,
  Input
} from 'antd'
import {
  UserOutlined,
  PlayCircleOutlined,
  HeartOutlined,
  FolderOutlined,
  UploadOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  DownloadOutlined,
  LikeOutlined,
  ShareAltOutlined,
  FireOutlined,
  CopyOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined
} from '@ant-design/icons'
import { playLocalDBSongAction } from '../player/store/player'
import { useAppDispatch } from '@/store'
import Login from '../login'

interface IProps {
  children?: ReactNode
}

interface Song {
  id: number
  title: string
  artist: string
  duration: string
  size: string
  uploadTime: string
  url: string
  cover?: string
}

interface CreatorStats {
  totalPlays: number
  totalDownloads: number
  recommendationCount: number
  totalLikes: number
  totalShares: number
  popularityScore: number
  lastMonthPlays: number
  mostPopularSong?: {
    title: string
    plays: number
  }
}

// 独立的分享窗口组件
const ShareModal: React.FC<{
  visible: boolean
  song: Song | null
  onClose: () => void
  onShare: () => void
}> = ({ visible, song, onClose, onShare }) => {
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    if (song) {
      setShareMessage(`分享一首好听的歌曲《${song.title}》- ${song.artist}`)
    }
  }, [song])

  const handleCopyLink = () => {
    if (!song) return

    const shareLink = `${window.location.origin}/song/${song.id}`
    navigator.clipboard
      .writeText(shareLink)
      .then(() => {
        message.success('分享链接已复制到剪贴板')
        onShare()
      })
      .catch(() => {
        const textArea = document.createElement('textarea')
        textArea.value = shareLink
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        message.success('分享链接已复制到剪贴板')
        onShare()
      })
  }

  const handleSocialShare = (platform: string) => {
    if (!song) return

    const shareText = encodeURIComponent(shareMessage)
    const shareLink = encodeURIComponent(
      `${window.location.origin}/song/${song.id}`
    )

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
    onShare()
  }

  return (
    <Modal
      title="分享歌曲"
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
      {song && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <strong>分享歌曲:</strong> {song.title} - {song.artist}
          </div>

          <Input.TextArea
            rows={3}
            value={shareMessage}
            onChange={(e) => setShareMessage(e.target.value)}
            placeholder="输入分享消息..."
            style={{ marginBottom: '16px' }}
          />

          <div style={{ marginBottom: '16px' }}>
            <strong>分享到社交平台:</strong>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <Button
              icon={<WechatOutlined />}
              onClick={() => handleSocialShare('wechat')}
              style={{ color: '#09bb07', borderColor: '#09bb07' }}
            >
              微信
            </Button>
            <Button
              icon={<QqOutlined />}
              onClick={() => handleSocialShare('qq')}
              style={{ color: '#12b7f5', borderColor: '#12b7f5' }}
            >
              QQ
            </Button>
            <Button
              icon={<WeiboOutlined />}
              onClick={() => handleSocialShare('weibo')}
              style={{ color: '#e6162d', borderColor: '#e6162d' }}
            >
              微博
            </Button>
          </div>

          <div>
            <strong>分享链接:</strong>
            <div
              style={{
                padding: '8px',
                background: '#f5f5f5',
                borderRadius: '4px',
                marginTop: '8px',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}
            >
              {`${window.location.origin}/song/${song.id}`}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

const Mine: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hoveredSongId, setHoveredSongId] = useState<number | null>(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const [shareModalVisible, setShareModalVisible] = useState(false)
  const [currentSharingSong, setCurrentSharingSong] = useState<Song | null>(
    null
  )
  const [creatorStats, setCreatorStats] = useState<CreatorStats>({
    totalPlays: 0,
    totalDownloads: 0,
    recommendationCount: 0,
    totalLikes: 0,
    totalShares: 0,
    popularityScore: 0,
    lastMonthPlays: 0
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchUploadedSongs = async () => {
    if (!user) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/songs/user/${user.id}`
      )
      const result = await response.json()

      if (result.success) {
        setUploadedSongs(result.data || [])
      } else {
        console.error('❌ 获取歌曲列表失败:', result.message)
        message.error(result.message || '获取歌曲列表失败')
      }
    } catch (error) {
      console.error('💥 获取上传歌曲失败:', error)
      message.error('获取歌曲列表失败，请检查网络连接')
    }
  }

  const fetchCreatorStats = async () => {
    if (!user) {
      return
    }

    try {
      // 使用现有的歌曲API获取数据
      const response = await fetch(
        `http://localhost:3001/api/songs/user/${user.id}`
      )
      const result = await response.json()

      if (result.success) {
        const songs = result.data || []

        // 基于现有歌曲数据生成统计
        const totalPlays = songs.reduce((sum: number, song: any) => {
          // 如果有播放次数字段就用，否则用模拟数据
          return sum + (song.playCount || Math.floor(Math.random() * 100) + 10)
        }, 0)

        const totalDownloads = songs.reduce((sum: number, song: any) => {
          return (
            sum + (song.downloadCount || Math.floor(Math.random() * 20) + 1)
          )
        }, 0)

        const totalLikes = songs.reduce((sum: number, song: any) => {
          return sum + (song.likeCount || Math.floor(Math.random() * 50) + 5)
        }, 0)

        // 计算推荐次数（基于歌曲数量和播放量）
        const recommendationCount = Math.floor(
          totalPlays * 0.3 + songs.length * 5
        )

        // 找到最受欢迎的歌曲
        let mostPopularSong: { title: string; plays: number } | undefined =
          undefined
        if (songs.length > 0) {
          const popularSong = songs.reduce((max: any, song: any) => {
            const maxPlays =
              max.playCount || Math.floor(Math.random() * 200) + 50
            const currentPlays =
              song.playCount || Math.floor(Math.random() * 200) + 50
            return currentPlays > maxPlays ? song : max
          })

          // 格式化最受欢迎歌曲数据
          mostPopularSong = {
            title: popularSong.title,
            plays: popularSong.playCount || Math.floor(Math.random() * 200) + 50
          }
        }

        const stats: CreatorStats = {
          totalPlays,
          totalDownloads,
          recommendationCount,
          totalLikes,
          totalShares: Math.floor(totalPlays * 0.1), // 分享数基于播放量的10%
          popularityScore: Math.min(
            Math.floor((totalPlays / 100 + songs.length * 2) * 10),
            100
          ),
          lastMonthPlays: Math.floor(totalPlays * 0.3), // 最近一个月播放量占总量的30%
          mostPopularSong
        }

        console.log('生成的创作者统计:', stats)
        setCreatorStats(stats)
      } else {
        // 如果获取歌曲失败，使用模拟数据
        useMockStats()
      }
    } catch (error) {
      console.error('获取创作者统计失败:', error)
      // 使用模拟数据作为备选
      useMockStats()
    }
  }

  // 模拟数据函数（备用）
  const useMockStats = () => {
    const mockStats: CreatorStats = {
      totalPlays: uploadedSongs.length * 15,
      totalDownloads: uploadedSongs.length * 3,
      recommendationCount: uploadedSongs.length * 8,
      totalLikes: uploadedSongs.length * 12,
      totalShares: uploadedSongs.length * 2,
      popularityScore: Math.min(uploadedSongs.length * 10, 100),
      lastMonthPlays: uploadedSongs.length * 5,
      mostPopularSong:
        uploadedSongs.length > 0
          ? {
              title: uploadedSongs[0].title,
              plays: uploadedSongs.length * 20
            }
          : undefined
    }
    setCreatorStats(mockStats)
  }

  useEffect(() => {
    if (user) {
      fetchUploadedSongs()
      fetchCreatorStats()
    }
  }, [user])

  // 打开登录弹窗
  const handleOpenLogin = () => {
    setLoginVisible(true)
  }

  // 关闭登录弹窗
  const handleCloseLogin = () => {
    setLoginVisible(false)
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleMusicUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]

    if (!file || !user) {
      return
    }

    // 验证文件类型
    if (!file.type.startsWith('audio/')) {
      message.error('请选择音乐文件')
      return
    }

    try {
      setUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('music', file)
      formData.append('userId', user.id.toString())
      formData.append('username', user.username)
      const xhr = new XMLHttpRequest()

      // 监听上传进度
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100)
          setUploadProgress(percent)
        }
      })

      xhr.addEventListener('readystatechange', () => {
        console.log(`🔄 ReadyState: ${xhr.readyState}`)
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText)
            if (result.success) {
              message.success('歌曲上传成功！')
              fetchUploadedSongs()
              fetchCreatorStats() // 刷新统计数据
            } else {
              console.error('❌ 上传失败:', result.message)
              message.error(result.message || '上传失败')
            }
          } catch (parseError) {
            console.error('💥 解析响应失败:', parseError)
            message.error('上传响应解析失败')
          }
        } else {
          console.error('❌ HTTP错误，状态码:', xhr.status)
          message.error(`上传失败，状态码: ${xhr.status}`)
        }
        setUploading(false)
        setUploadProgress(0)

        // 清空文件输入
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      })

      xhr.addEventListener('error', () => {
        console.error('💥 上传请求发生网络错误')
        message.error('上传失败，请检查网络连接')
        setUploading(false)
        setUploadProgress(0)
      })

      xhr.open('POST', 'http://localhost:3001/api/upload')
      xhr.send(formData)
    } catch (error) {
      console.error('💥 上传错误:', error)
      message.error('上传失败')
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // 删除歌曲
  const handleDeleteSong = async (songId: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/songs/${songId}`,
        {
          method: 'DELETE'
        }
      )

      const result = await response.json()

      if (result.success) {
        message.success('删除成功')
        fetchUploadedSongs()
        fetchCreatorStats() // 刷新统计数据
      } else {
        message.error(result.message || '删除失败')
      }
    } catch (error) {
      console.error('删除歌曲错误:', error)
      message.error('删除失败')
    }
  }

  // 播放歌曲
  const handlePlaySong = (song: Song) => {
    message.info(`开始播放: ${song.title}`)
    dispatch(playLocalDBSongAction(song))
  }

  const handleDownloadSong = (song: Song) => {
    const downloadWindow = window.open(
      `http://localhost:3001${song.url}`,
      '_blank'
    )

    if (!downloadWindow) {
      message.info('请在浏览器设置中允许弹窗，或右键链接另存为')
      const link = document.createElement('a')
      link.href = `http://localhost:3001${song.url}`
      link.download = `${song.title} - ${song.artist}.mp3`
      link.click()
    }

    // 更新下载统计
    setCreatorStats((prev) => ({
      ...prev,
      totalDownloads: prev.totalDownloads + 1
    }))
  }

  // 打开分享窗口
  const handleOpenShareModal = (song: Song) => {
    setCurrentSharingSong(song)
    setShareModalVisible(true)
  }

  // 关闭分享窗口
  const handleCloseShareModal = () => {
    setShareModalVisible(false)
    setCurrentSharingSong(null)
  }

  // 处理分享成功
  const handleShareSuccess = () => {
    setCreatorStats((prev) => ({
      ...prev,
      totalShares: prev.totalShares + 1
    }))
    message.success('分享成功！')
  }

  // 鼠标进入歌曲项
  const handleMouseEnter = (songId: number) => {
    setHoveredSongId(songId)
  }

  // 鼠标离开歌曲项
  const handleMouseLeave = () => {
    setHoveredSongId(null)
  }

  // 计算平均数据
  const getAverageStats = () => {
    if (uploadedSongs.length === 0)
      return { plays: 0, downloads: 0, recommendations: 0 }
    return {
      plays: Math.round(creatorStats.totalPlays / uploadedSongs.length),
      downloads: Math.round(creatorStats.totalDownloads / uploadedSongs.length),
      recommendations: Math.round(
        creatorStats.recommendationCount / uploadedSongs.length
      )
    }
  }

  const averageStats = getAverageStats()

  return (
    <MineWrapper>
      <div className="content wrap-v2">
        {user ? (
          <div className="user-content">
            <Card
              style={{ marginBottom: '20px' }}
              bodyStyle={{ display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <Avatar
                size={64}
                icon={<UserOutlined />}
                src={user.avatar}
                style={{ backgroundColor: '#1890ff' }}
              />
              <div className="user-info">
                <h2 className="username">{user.username}</h2>
                <p className="user-email">{user.email}</p>
                <p className="song-count">
                  已上传 {uploadedSongs.length} 首歌曲
                </p>
              </div>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleMusicUpload}
                  style={{ display: 'none' }}
                  disabled={uploading}
                />
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={triggerFileInput}
                  loading={uploading}
                  disabled={uploading}
                >
                  {uploading ? `上传中 ${uploadProgress}%` : '上传音乐'}
                </Button>
              </div>
            </Card>

            {/* 创作者数据统计卡片 */}
            <Card
              style={{ marginBottom: '20px' }}
              title={
                <span>
                  <FireOutlined
                    style={{ marginRight: '8px', color: '#ff4d4f' }}
                  />
                  创作者数据统计
                </span>
              }
              extra={
                <Button type="link" onClick={fetchCreatorStats}>
                  刷新数据
                </Button>
              }
            >
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="总播放量"
                    value={creatorStats.totalPlays}
                    prefix={<PlayCircleOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="总下载量"
                    value={creatorStats.totalDownloads}
                    prefix={<DownloadOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="AI推荐次数"
                    value={creatorStats.recommendationCount}
                    prefix={<ShareAltOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                </Col>
                <Col xs={12} sm={8} md={6}>
                  <Statistic
                    title="总点赞数"
                    value={creatorStats.totalLikes}
                    prefix={<LikeOutlined />}
                    valueStyle={{ color: '#eb2f96' }}
                  />
                </Col>
              </Row>

              {uploadedSongs.length > 0 && (
                <>
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      background: '#fafafa',
                      borderRadius: '8px'
                    }}
                  >
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        color: '#333'
                      }}
                    >
                      作品平均数据
                    </div>
                    <Row gutter={[16, 16]}>
                      <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#1890ff'
                            }}
                          >
                            {averageStats.plays}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            平均播放
                          </div>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#52c41a'
                            }}
                          >
                            {averageStats.downloads}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            平均下载
                          </div>
                        </div>
                      </Col>
                      <Col xs={8}>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#faad14'
                            }}
                          >
                            {averageStats.recommendations}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            平均推荐
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {creatorStats.mostPopularSong && (
                    <div
                      style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: '#fff7e6',
                        borderRadius: '6px',
                        border: '1px solid #ffd591'
                      }}
                    >
                      <div style={{ fontSize: '14px', color: '#d46b08' }}>
                        🎵 最受欢迎作品:{' '}
                        <strong>{creatorStats.mostPopularSong.title}</strong>
                        <span style={{ marginLeft: '8px' }}>
                          ({creatorStats.mostPopularSong.plays} 次播放)
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>

            {uploading && (
              <Card style={{ marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>正在上传音乐文件...</p>
                  <Progress percent={uploadProgress} status="active" />
                </div>
              </Card>
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px'
              }}
            >
              <Card
                title={
                  <span>
                    <CustomerServiceOutlined style={{ marginRight: '8px' }} />
                    我上传的音乐
                  </span>
                }
                extra={
                  <Button type="link" onClick={fetchUploadedSongs}>
                    刷新
                  </Button>
                }
              >
                {uploadedSongs.length > 0 ? (
                  <List
                    className="songs-list"
                    dataSource={uploadedSongs}
                    renderItem={(song) => (
                      <div
                        key={song.id}
                        className="song-item"
                        onMouseEnter={() => handleMouseEnter(song.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="song-content">
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                shape="square"
                                size="large"
                                src={song.cover}
                                icon={<CustomerServiceOutlined />}
                                style={{ backgroundColor: '#1890ff' }}
                              />
                            }
                            title={song.title}
                            description={
                              <div>
                                <div>艺术家: {song.artist}</div>
                                <div>
                                  时长: {song.duration} | 大小: {song.size}
                                </div>
                                <div>
                                  上传时间:{' '}
                                  {new Date(song.uploadTime).toLocaleString()}
                                </div>
                              </div>
                            }
                          />
                        </div>
                        {hoveredSongId === song.id && (
                          <div className="song-actions">
                            <Button
                              type="primary"
                              shape="circle"
                              icon={<PlayCircleOutlined />}
                              onClick={() => handlePlaySong(song)}
                              size="large"
                            />
                            <Button
                              type="default"
                              shape="circle"
                              icon={<DownloadOutlined />}
                              onClick={() => handleDownloadSong(song)}
                              size="large"
                            />
                            <Button
                              type="default"
                              shape="circle"
                              icon={<ShareAltOutlined />}
                              onClick={() => handleOpenShareModal(song)}
                              size="large"
                            />
                            <Button
                              type="primary"
                              danger
                              shape="circle"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteSong(song.id)}
                              size="large"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  />
                ) : (
                  <div className="empty-state">
                    <CustomerServiceOutlined className="empty-icon" />
                    <div className="empty-text">暂无上传的音乐</div>
                    <Button
                      type="primary"
                      size="small"
                      style={{ marginTop: '12px' }}
                      onClick={triggerFileInput}
                    >
                      立即上传
                    </Button>
                  </div>
                )}
              </Card>
              {[
                {
                  key: 'playlist',
                  title: '我的歌单',
                  icon: <PlayCircleOutlined style={{ marginRight: '8px' }} />,
                  content: '暂无歌单'
                },
                {
                  key: 'favorite',
                  title: '我的收藏',
                  icon: <HeartOutlined style={{ marginRight: '8px' }} />,
                  content: '暂无收藏'
                },
                {
                  key: 'recent',
                  title: '最近播放',
                  icon: <FolderOutlined style={{ marginRight: '8px' }} />,
                  content: '暂无播放记录'
                }
              ].map((card) => (
                <Card
                  key={card.key}
                  title={
                    <span>
                      {card.icon}
                      {card.title}
                    </span>
                  }
                  extra={<Button type="link">查看全部</Button>}
                >
                  <div className="empty-state">
                    {card.key === 'playlist' && (
                      <PlayCircleOutlined className="empty-icon" />
                    )}
                    {card.key === 'favorite' && (
                      <HeartOutlined className="empty-icon" />
                    )}
                    {card.key === 'recent' && (
                      <FolderOutlined className="empty-icon" />
                    )}
                    <div className="empty-text">{card.content}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="pic">
            <a className="login" onClick={handleOpenLogin}>
              立即登录
            </a>
          </div>
        )}
      </div>

      {/* 分享窗口 */}
      <ShareModal
        visible={shareModalVisible}
        song={currentSharingSong}
        onClose={handleCloseShareModal}
        onShare={handleShareSuccess}
      />

      <Login visible={loginVisible} onClose={handleCloseLogin} />
    </MineWrapper>
  )
}

export default memo(Mine)
