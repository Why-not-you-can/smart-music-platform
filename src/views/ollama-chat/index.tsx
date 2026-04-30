import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import {
  fetchCurrentSongAction,
  changePlaySongListAction,
  changePlaySongIndexAction
} from '@/views/player/store/player'
import { formatTime, formatCount, getImageSize } from '@/utlis/format'
import default_album from '@/assets/img/default_album.jpg'
import { getPlaylistDetail } from '@/views/discover/c-views/songs/service/song'
import { getHotRecommend } from '@/views/discover/c-views/recommend/service/recommend'
import aiAvatar from '@/assets/img/music_elves.jpg'
import defaultUserAvatar from '@/assets/img/default_user.jpg'
import { ChatWindow, LoadingIndicator, ToggleButton } from './style'
import { useUser } from '@/context/user-context'
import Login from '../login'
import { message, Modal, Button, Input } from 'antd'
import {
  DownloadOutlined,
  ShareAltOutlined,
  CopyOutlined,
  WechatOutlined,
  QqOutlined,
  WeiboOutlined
} from '@ant-design/icons'
interface TimeInfo {
  hour: number
  period: string
  season: string
  isWeekend: boolean
}

interface WeatherInfo {
  city: string
  weather: string
  temperature: number
  humidity?: number
  wind?: string
}

interface UploadUser {
  id: number
  name: string
  avatar?: string
}

interface SongItem {
  id: number
  name: string
  artist: string
  duration?: number
  playCount?: number
  coverUrl?: string
  al?: {
    picUrl?: string
    name?: string
  }
  ar?: Array<{ id: number; name: string }>
  dt?: number
  isUserUploaded?: boolean
  userId?: number
  source?: string
  url?: string
  uploadUser?: UploadUser // 添加上传用户信息
}

interface PlaylistCreator {
  nickname: string
  [key: string]: any
}

interface PlaylistItem {
  id: number
  name: string
  coverImgUrl: string
  trackCount?: number
  playCount?: number
  creator?: PlaylistCreator
  [key: string]: any
}

interface MessageItem {
  id: string
  role: 'user' | 'assistant'
  content: string
  songs?: SongItem[]
  playlists?: PlaylistItem[]
  options?: string[]
}

interface Position {
  x: number
  y: number
}

// 聊天API服务函数 - 使用本地Ollama
const chatWithAI = async (
  message: string,
  signal?: AbortSignal
): Promise<string> => {
  try {
    const response = await fetch('http://localhost:11435/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-r1:1.5b', // 可以使用你安装的模型
        messages: [{ role: 'user', content: message }],
        stream: false
      }),
      signal
    })

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.message && data.message.content) {
      let content = data.message.content

      // 过滤掉思考标签
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()

      // 如果过滤后内容为空，使用原始内容
      if (!content) {
        content = data.message.content
      }

      return content
    } else {
      throw new Error('Invalid response format from Ollama')
    }
  } catch (error) {
    // 修复：添加类型检查
    if (error instanceof Error && error.name === 'AbortError') {
      throw error
    }
    // 模拟智能回复
    return getMockAIResponse(message)
  }
}

// 模拟AI回复函数
const getMockAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  // 问候相关
  if (
    lowerMessage.includes('你好') ||
    lowerMessage.includes('嗨') ||
    lowerMessage.includes('hello')
  ) {
    return '你好！我是你的智能音乐助手，可以和你聊天，也可以为你推荐音乐。有什么我可以帮你的吗？'
  }

  // 感谢相关
  if (lowerMessage.includes('谢谢') || lowerMessage.includes('感谢')) {
    return '不用客气！我很高兴能帮到你。如果你需要音乐推荐或者想聊天，随时告诉我~'
  }

  // 音乐相关关键词
  const musicKeywords = ['歌', '音乐', '听', '播放', '推荐', '歌手', '专辑']
  const hasMusicKeyword = musicKeywords.some((keyword) =>
    lowerMessage.includes(keyword)
  )

  if (hasMusicKeyword) {
    return '看起来你对音乐很感兴趣呢！我可以根据你的心情、时间或天气为你推荐合适的歌曲。比如你可以说"推荐一些轻松的音乐"或者"下雨天适合听什么歌？"'
  }

  // 天气相关
  if (
    lowerMessage.includes('天气') ||
    lowerMessage.includes('下雨') ||
    lowerMessage.includes('晴天')
  ) {
    return '我可以根据天气为你推荐合适的音乐哦！比如下雨天适合听一些轻柔的钢琴曲或爵士乐，晴天则适合欢快的流行歌曲。'
  }

  // 时间相关
  if (
    lowerMessage.includes('早上') ||
    lowerMessage.includes('早晨') ||
    lowerMessage.includes('中午') ||
    lowerMessage.includes('下午') ||
    lowerMessage.includes('晚上') ||
    lowerMessage.includes('深夜')
  ) {
    return '不同时间段适合的音乐风格也不一样呢！早晨适合活力满满的歌曲，晚上则适合放松的轻音乐。需要我为你推荐吗？'
  }

  // 心情相关
  if (
    lowerMessage.includes('开心') ||
    lowerMessage.includes('高兴') ||
    lowerMessage.includes('快乐')
  ) {
    return '听到你开心我也很高兴！这时候适合听一些欢快的流行歌曲或者电子音乐来让好心情延续下去~'
  }

  if (
    lowerMessage.includes('伤心') ||
    lowerMessage.includes('难过') ||
    lowerMessage.includes('悲伤')
  ) {
    return '抱抱你~ 难过的时候可以听一些舒缓的轻音乐或者治愈系的歌曲，让音乐陪伴你度过这段时光。'
  }

  if (
    lowerMessage.includes('放松') ||
    lowerMessage.includes('休息') ||
    lowerMessage.includes('累')
  ) {
    return '辛苦啦！放松的时候适合听一些轻音乐、古典乐或者自然音效，让身心得到充分的休息。'
  }

  // 默认回复
  const defaultResponses = [
    '很有趣的话题！虽然我主要擅长音乐推荐，但也很乐意和你聊天。',
    '我明白你的意思了！作为音乐助手，我可以为你推荐适合各种场景的歌曲哦。',
    '这个话题很有意思！如果你需要音乐相关的帮助，我随时在这里。',
    '感谢分享！如果你想要一些音乐推荐来配合现在的心情，我很乐意帮忙。',
    '我主要专注于音乐推荐，但也很享受和你的对话。有什么音乐方面的问题吗？'
  ]

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
}

// 获取可用的模型列表
const getAvailableModels = async (): Promise<string[]> => {
  try {
    const response = await fetch('http://localhost:11435/api/tags')
    if (response.ok) {
      const data = await response.json()
      return data.models?.map((model: any) => model.name) || []
    }
  } catch (error) {
    console.warn('无法获取模型列表:', error)
  }
  return []
}

// 分享模态框组件
const ShareModal: React.FC<{
  visible: boolean
  song: SongItem | null
  onClose: () => void
  onShare: () => void
}> = ({ visible, song, onClose, onShare }) => {
  const [shareMessage, setShareMessage] = useState('')

  useEffect(() => {
    if (song) {
      setShareMessage(`分享一首好听的歌曲《${song.name}》- ${song.artist}`)
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
            <strong>分享歌曲:</strong> {song.name} - {song.artist}
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

// 工具函数：生成唯一ID
const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).substr(2, 8)

// 样式组件 - 添加可拖动功能

const OllamaChat: React.FC = () => {
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false)
  const [currentSharingSong, setCurrentSharingSong] = useState<SongItem | null>(
    null
  )
  const [visitorMessageCount, setVisitorMessageCount] = useState<number>(0)
  const [isVisitorLimited, setIsVisitorLimited] = useState<boolean>(false)
  const VISITOR_MESSAGE_LIMIT = 5
  const { user } = useUser()
  const isVisitor = useCallback((): boolean => {
    return !user
  }, [user])
  // 状态管理
  const [visible, setVisible] = useState<boolean>(false)
  const [messages, setMessages] = useState<MessageItem[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [weather, setWeather] = useState<WeatherInfo | null>(null)
  const [currentTime, setCurrentTime] = useState<TimeInfo | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('deepseek-r1:1.5b')

  // 新增状态：用于随机推荐和拖动功能
  const [usedSongIds, setUsedSongIds] = useState<Set<number>>(new Set())
  const [usedPlaylistIds, setUsedPlaylistIds] = useState<Set<number>>(new Set())
  const [position, setPosition] = useState<Position>({
    x: window.innerWidth - 480,
    y: 100
  })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const dispatch = useAppDispatch()
  const { playSongList } = useAppSelector((state) => state.player)

  // 获取当前时间信息
  const getCurrentTimeInfo = useCallback((): TimeInfo => {
    const now = new Date()
    const hour = now.getHours()
    const month = now.getMonth() + 1
    const day = now.getDay()

    let period: string
    if (hour >= 0 && hour < 6) period = '凌晨'
    else if (hour >= 6 && hour < 9) period = '早晨'
    else if (hour >= 9 && hour < 12) period = '上午'
    else if (hour >= 12 && hour < 14) period = '中午'
    else if (hour >= 14 && hour < 18) period = '下午'
    else if (hour >= 18 && hour < 20) period = '傍晚'
    else if (hour >= 20 && hour < 23) period = '晚上'
    else period = '深夜'

    let season: string
    if (month >= 3 && month <= 5) season = '春'
    else if (month >= 6 && month <= 8) season = '夏'
    else if (month >= 9 && month <= 11) season = '秋'
    else season = '冬'

    return {
      hour,
      period,
      season,
      isWeekend: day === 0 || day === 6
    }
  }, [])

  // 获取天气信息（模拟）
  const getWeatherInfo = useCallback(async (): Promise<WeatherInfo> => {
    const weatherTypes = [
      { weather: '晴', temperature: 25, humidity: 45, wind: '微风' },
      { weather: '多云', temperature: 22, humidity: 60, wind: '轻风' },
      { weather: '阴', temperature: 20, humidity: 70, wind: '和风' },
      { weather: '小雨', temperature: 18, humidity: 85, wind: '轻风' },
      { weather: '中雨', temperature: 16, humidity: 90, wind: '微风' },
      { weather: '雷阵雨', temperature: 19, humidity: 80, wind: '阵风' }
    ]

    const randomWeather =
      weatherTypes[Math.floor(Math.random() * weatherTypes.length)]

    return {
      ...randomWeather,
      city: '北京'
    }
  }, [])

  // 初始化时间和天气信息
  useEffect(() => {
    const initContextInfo = async () => {
      const timeInfo = getCurrentTimeInfo()
      const weatherInfo = await getWeatherInfo()

      setCurrentTime(timeInfo)
      setWeather(weatherInfo)
    }

    initContextInfo()

    const timeInterval = setInterval(() => {
      setCurrentTime(getCurrentTimeInfo())
    }, 60000)

    const weatherInterval = setInterval(async () => {
      const weatherInfo = await getWeatherInfo()
      setWeather(weatherInfo)
    }, 1800000)

    return () => {
      clearInterval(timeInterval)
      clearInterval(weatherInterval)
    }
  }, [getCurrentTimeInfo, getWeatherInfo])

  useEffect(() => {
    if (visible) {
      getAvailableModels().then((models) => {
        if (models.length > 0 && !models.includes(selectedModel)) {
          setSelectedModel(models[0])
        }
      })
    }
  }, [visible, selectedModel])

  // 自动滚动到最新消息
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      setVisitorMessageCount(0)
      setIsVisitorLimited(false)
    }
  }, [])

  // 开场白
  useEffect(() => {
    if (visible && messages.length === 0) {
      const welcomeMessage: MessageItem = {
        id: generateId(),
        role: 'assistant',
        content:
          '你好！我是智能音乐助手，既可以和你聊天，也能根据时间、天气和场景为你推荐合适的音乐。有什么想聊的或想听的音乐吗？~'
      }
      setMessages([welcomeMessage])
    }
    setUsedSongIds(new Set())
    setUsedPlaylistIds(new Set())
    setVisitorMessageCount(0)
    setIsVisitorLimited(false)
    setInput('')
  }, [visible])

  // 工具函数：获取未使用过的随机项目 - 修复重复问题
  const getUnusedRandomItems = useCallback(
    <T extends { id: number }>(
      allItems: T[],
      usedIds: Set<number>,
      count: number
    ): { items: T[]; newUsedIds: Set<number> } => {
      if (allItems.length === 0) {
        return { items: [], newUsedIds: new Set() }
      }
      if (usedIds.size >= allItems.length) {
        const selectedItems = allItems
          .sort(() => Math.random() - 0.5)
          .slice(0, count)
        const newUsedIds = new Set(selectedItems.map((item) => item.id))
        return { items: selectedItems, newUsedIds }
      }

      const unusedItems = allItems.filter((item) => !usedIds.has(item.id))
      if (unusedItems.length < count) {
        const needed = count - unusedItems.length
        const usedItems = allItems
          .filter((item) => usedIds.has(item.id))
          .sort(() => Math.random() - 0.5)
          .slice(0, needed)

        const selectedItems = [...unusedItems, ...usedItems]
          .sort(() => Math.random() - 0.5)
          .slice(0, count)

        const newUsedIds = new Set([
          ...usedIds,
          ...selectedItems.map((item) => item.id)
        ])
        return { items: selectedItems, newUsedIds }
      }

      const selectedItems = unusedItems
        .sort(() => Math.random() - 0.5)
        .slice(0, count)

      const newUsedIds = new Set([
        ...usedIds,
        ...selectedItems.map((item) => item.id)
      ])

      return { items: selectedItems, newUsedIds }
    },
    []
  )
  const parseDuration = (durationStr: string): number => {
    if (!durationStr) return 180000

    if (typeof durationStr === 'number') {
      return durationStr
    }
    const parts = durationStr.split(':')
    if (parts.length === 2) {
      const minutes = parseInt(parts[0])
      const seconds = parseInt(parts[1])
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return (minutes * 60 + seconds) * 1000
      }
    }
    const seconds = parseInt(durationStr)
    if (!isNaN(seconds)) {
      return seconds * 1000
    }

    return 180000
  }

  // 根据场景推荐歌曲
  const getSongsByContext = useCallback(async (): Promise<SongItem[]> => {
    try {
      let userUploadedSongs: SongItem[] = []
      let allSongs: SongItem[] = []

      // ========== 获取所有用户上传歌曲 ==========
      try {
        const response = await fetch(`http://localhost:3001/api/songs`)

        if (response.ok) {
          const data = await response.json()

          if (data.success && data.data && data.data.length > 0) {
            userUploadedSongs = data.data.map((song: any) => {
              return {
                id: song.id,
                name: song.title || '用户上传歌曲',
                artist: song.artist || '未知歌手',
                duration: song.duration ? parseDuration(song.duration) : 180000,
                coverUrl: song.cover,
                url: song.url,
                isUserUploaded: true,
                source: 'user_upload',
                al: song.cover ? { picUrl: song.cover } : undefined,
                ar: [{ id: 0, name: song.artist || '未知歌手' }],
                // 添加用户信息
                uploadUser: {
                  id: song.userId || 0,
                  name: song.username || '未知用户',
                  avatar: song.userAvatar || defaultUserAvatar
                }
              }
            })
          }
        } else {
          console.log('❌ 获取用户上传歌曲API失败')
        }
      } catch (error) {
        console.log('❌ 无法获取用户上传歌曲:', error)
      }

      try {
        const hotData = await getHotRecommend(100)
        const playlists = hotData.playlists || hotData.result || []

        const playlistPromises = playlists
          .slice(0, 10)
          .map(async (playlist: any) => {
            try {
              const detailData = await getPlaylistDetail(playlist.id)
              const tracks = detailData?.playlist?.tracks || []

              return tracks.slice(0, 3).map((track: any) => {
                const artistArray = track.ar || track.artists || []
                const safeArtistArray = Array.isArray(artistArray)
                  ? artistArray
                  : []
                if (safeArtistArray.length === 0) {
                  safeArtistArray.push({ id: 0, name: '未知歌手' })
                }

                return {
                  id: track.id,
                  name: track.name || '未知歌曲',
                  artist: safeArtistArray[0].name || '未知歌手',
                  duration: track.dt || track.duration,
                  playCount:
                    playlist.playCount || Math.floor(Math.random() * 1000000),
                  coverUrl: track.al?.picUrl || track.album?.picUrl,
                  al: track.al || undefined,
                  ar: safeArtistArray,
                  dt: track.dt || track.duration,
                  isUserUploaded: false,
                  source: 'netease'
                }
              })
            } catch {
              return []
            }
          })

        const playlistResults = await Promise.allSettled(playlistPromises)
        playlistResults.forEach((result) => {
          if (result.status === 'fulfilled' && result.value) {
            allSongs.push(...result.value)
          }
        })
      } catch (error) {
        allSongs = [
          {
            id: 459412983,
            name: '问剑江湖',
            artist: '双笙（陈元汐）',
            duration: 210735,
            al: {
              picUrl:
                'https://p2.music.126.net/kYQpT3APewWiItsEVH4GDw==/109951162858968959.jpg'
            },
            ar: [{ id: 12025552, name: '双笙（陈元汐）' }],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 26304123,
            name: '情话',
            artist: '徐良',
            duration: 238598,
            al: {
              picUrl:
                'https://p2.music.126.net/Eiq_XiRNqiXJEwmFzLTtow==/109951172050975516.jpg'
            },
            ar: [{ id: 5929, name: '徐良' }],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 1394167216,
            name: '知我',
            artist: '国风堂/哦漏',
            duration: 277321,
            al: {
              picUrl:
                'https://p2.music.126.net/_etyUh1ofScyTMFArsJXWg==/109951164415301539.jpg'
            },
            ar: [
              { id: 31862479, name: '国风堂' },
              { id: 1085108, name: '哦漏' }
            ],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 2722510685,
            name: '耀斑',
            artist: 'HOYO-MiX/YMIR',
            duration: 213691,
            al: {
              picUrl:
                'https://p1.music.126.net/DYDACa_8zB5irAOrasVgnQ==/109951171396677694.jpg'
            },
            ar: [
              { id: 12487174, name: 'HOYO-MiX' },
              { id: 105754, name: 'YMIR' }
            ],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 2709812973,
            name: '拂晓 Proi Proi',
            artist: 'HOYO-MiX/NIDA',
            duration: 238378,
            al: {
              picUrl:
                'https://p2.music.126.net/2qGGwWFlMYF2o-GyNMhH5A==/109951171066942237.jpg'
            },
            ar: [
              { id: 12487174, name: 'HOYO-MiX' },
              { id: 29702684, name: 'NIDA' }
            ],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 2112860964,
            name: '过长夜',
            artist: '鲜克',
            duration: 277504,
            al: {
              picUrl:
                'https://p1.music.126.net/lMFpD2PuDMW8sRsl4MRv7w==/109951169220428488.jpg'
            },
            ar: [{ id: 33584072, name: '鲜克' }],
            isUserUploaded: false,
            source: 'netease'
          }
        ]
      }

      if (allSongs.length === 0) {
        allSongs = [
          {
            id: 459412983,
            name: '问剑江湖',
            artist: '双笙（陈元汐）',
            duration: 210735,
            al: {
              picUrl:
                'https://p2.music.126.net/kYQpT3APewWiItsEVH4GDw==/109951162858968959.jpg'
            },
            ar: [{ id: 12025552, name: '双笙（陈元汐）' }],
            isUserUploaded: false,
            source: 'netease'
          },
          {
            id: 26304123,
            name: '情话',
            artist: '徐良',
            duration: 238598,
            al: {
              picUrl:
                'https://p2.music.126.net/Eiq_XiRNqiXJEwmFzLTtow==/109951172050975516.jpg'
            },
            ar: [{ id: 5929, name: '徐良' }],
            isUserUploaded: false,
            source: 'netease'
          }
        ]
      }

      // ========== 关键修改：优先使用所有用户上传的歌曲 ==========
      // 过滤掉已经推荐过的用户上传歌曲
      const unusedUserSongs = userUploadedSongs.filter(
        (song) => !usedSongIds.has(song.id)
      )

      let finalSongs: SongItem[] = []

      // 如果有未推荐过的用户上传歌曲，只取前4首
      if (unusedUserSongs.length > 0) {
        finalSongs = unusedUserSongs.slice(0, 4)

        // 更新已使用的歌曲ID
        const newUsedIds = new Set([
          ...usedSongIds,
          ...finalSongs.map((song) => song.id)
        ])
        setUsedSongIds(newUsedIds)

        return finalSongs
      }

      // 如果没有用户上传歌曲或都已推荐过，则推荐平台歌曲
      let filteredSongs = [...allSongs]
      if (currentTime && weather) {
        if (currentTime.period === '早晨' || currentTime.period === '上午') {
          filteredSongs = filteredSongs.filter(
            (song) =>
              song.name.includes('晨') ||
              song.name.includes('早') ||
              song.name.includes('阳')
          )
        } else if (currentTime.period === '中午') {
          filteredSongs = filteredSongs.filter(
            (song) => song.name.includes('午') || song.name.includes('暖')
          )
        } else if (currentTime.period === '下午') {
          filteredSongs = filteredSongs.filter(
            (song) => song.name.includes('下') || song.name.includes('时')
          )
        } else if (
          currentTime.period === '晚上' ||
          currentTime.period === '深夜'
        ) {
          filteredSongs = filteredSongs.filter(
            (song) => song.name.includes('夜') || song.name.includes('晚')
          )
        }

        if (filteredSongs.length < 4) {
          filteredSongs = [...allSongs]
        }
      }

      const { items: selectedPlatformSongs, newUsedIds } = getUnusedRandomItems(
        filteredSongs,
        usedSongIds,
        4
      )
      setUsedSongIds(newUsedIds)

      finalSongs = selectedPlatformSongs

      return finalSongs
    } catch (error) {
      return [
        {
          id: 2054517809,
          name: '野草',
          artist: '椿乐队',
          duration: 271219,
          al: {
            picUrl:
              'https://p1.music.126.net/BuS8uTyCphdg-HxqiqljJQ==/109951168968052683.jpg'
          },
          ar: [{ id: 50931257, name: '椿乐队' }],
          isUserUploaded: false,
          source: 'netease'
        }
      ]
    }
  }, [currentTime, weather, usedSongIds, getUnusedRandomItems])

  // 获取推荐歌单
  const fetchRecommendedPlaylists = useCallback(async (): Promise<
    PlaylistItem[]
  > => {
    try {
      let allPlaylists: PlaylistItem[] = []

      try {
        const hotData = await getHotRecommend(100)
        const playlists = hotData.playlists || hotData.result || []

        allPlaylists = playlists.slice(0, 15).map((playlist: any) => {
          return {
            id: playlist.id,
            name: playlist.name || '未知歌单',
            coverImgUrl: playlist.picUrl || '',
            trackCount: playlist.trackCount,
            playCount: playlist.playCount,
            creator: playlist.creator
              ? {
                  nickname: playlist.creator.nickname || '未知创作者'
                }
              : undefined
          }
        })
      } catch (error) {
        allPlaylists = [
          {
            id: 8497873200,
            name: '重返2013 | 从修炼爱情开启2013金曲之旅',
            coverImgUrl:
              'https://p1.music.126.net/XPip5BHNx7wBo6b5WR9g_A==/109951171392250768.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzYxNzMyNDg0NDQzLzU0NjgvMjAyNTc3MTExNDU3L3g4MjcxNzU0NTM2NDk3MjA0LnBuZw==&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1',
            trackCount: 90,
            playCount: 719411,
            creator: { nickname: '云音乐经典专区' }
          },
          {
            id: 12525749161,
            name: '校园青春｜回忆90后学生时代',
            coverImgUrl:
              'https://p1.music.126.net/KUjtXxEEuswIOl8If9__bA==/109951169909945154.jpg',
            trackCount: 343,
            playCount: 122399,
            creator: { nickname: '祝你开心自由' }
          },
          {
            id: 2540031947,
            name: 'lofi hiphop✨ | 深夜or学习 |',
            coverImgUrl:
              'https://p1.music.126.net/zOaqOQ34zg82YjckA8VtDQ==/109951163779981076.jpg',
            trackCount: 806,
            playCount: 20481396,
            creator: { nickname: 'ordinary_joe' }
          },
          {
            id: 8457908661,
            name: '清晨醒脑 | 唤醒专注力的音乐',
            coverImgUrl:
              'https://p1.music.126.net/7cqTaOJsGpKIpXi1BCJTdQ==/109951168658816295.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzI4NzMyNDc4OTMzLzA3OGMvMjAyMzUxNDExNTM1MC94ODkzMTY4NjcxNDgzMDM4MS5wbmc=&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1',
            trackCount: 39,
            playCount: 46810,
            creator: { nickname: '云音乐歌单之友' }
          },
          {
            id: 7778495329,
            name: '下雨天 | 居家 睡觉 独处 享受一个人的时光',
            coverImgUrl:
              'https://p1.music.126.net/HsUtfcY8VmbkZ1wXWt5cew==/109951168104140358.jpg',
            trackCount: 45,
            playCount: 70877,
            creator: { nickname: '-孤岛与海_' }
          }
        ]
      }

      if (allPlaylists.length === 0) {
        allPlaylists = [
          {
            id: 13554846640,
            name: '国潮电子流行 | 掀起中国风电音舞曲潮流',
            coverImgUrl:
              'https://p1.music.126.net/eN4C-nBpxmxWfsTuIRWNNA==/109951170699878096.jpg?imageView=1&thumbnail=800y800&enlarge=1%7CimageView=1&watermark&type=1&image=b2JqL3c1bkRrTUtRd3JMRGpEekNtOE9tLzYxNzU5MzI2NDc2LzRjNjgvMjAyNTc4MTQxNzIzL3gxNDYxNzU0NjMzODQzNDE4LnBuZw==&dx=0&dy=0%7Cwatermark&type=1&image=b2JqL3dvbkRsc0tVd3JMQ2xHakNtOEt4LzI3NjEwNDk3MDYyL2VlOTMvOTIxYS82NjE4LzdhMDc5ZDg0NTYyMDAwZmVkZWJmMjVjYjE4NjhkOWEzLnBuZw==&dx=0&dy=0%7CimageView=1',
            trackCount: 40,
            playCount: 2263001,
            creator: { nickname: '云音乐国潮大赏' }
          }
        ]
      }

      const { items: selectedPlaylists, newUsedIds } = getUnusedRandomItems(
        allPlaylists,
        usedPlaylistIds,
        3
      )
      setUsedPlaylistIds(newUsedIds)

      return selectedPlaylists
    } catch (error) {
      return [
        {
          id: 7010846972,
          name: '崩坏：星穹铁道（全收录）',
          coverImgUrl:
            'https://p1.music.126.net/s4CoQHAWQAHxed68jBY9uA==/109951166501155915.jpg',
          trackCount: 465,
          playCount: 7429447,
          creator: { nickname: '澟丶' }
        }
      ]
    }
  }, [usedPlaylistIds, getUnusedRandomItems])

  // 根据关键词推荐
  const fetchSongsByKeyword = useCallback(
    async (keyword: string): Promise<SongItem[]> => {
      try {
        const allSongs = await getSongsByContext()

        const filteredSongs = allSongs.filter(
          (song) =>
            song.name.includes(keyword) ||
            song.artist.includes(keyword) ||
            (song.al?.name && song.al.name.includes(keyword))
        )

        return filteredSongs.length >= 2 ? filteredSongs.slice(0, 4) : allSongs
      } catch (error) {
        return getSongsByContext()
      }
    },
    [getSongsByContext]
  )

  // 播放歌曲
  const handlePlaySong = useCallback(
    async (songId: number, song: SongItem, e: React.MouseEvent) => {
      e.stopPropagation()

      if (loading) return

      setLoading(true)
      try {
        const safeSong: SongItem = {
          ...song,
          ar: song.ar || [{ id: 0, name: song.artist }],
          dt: song.dt || song.duration || 0
        }

        const existingIndex = playSongList.findIndex(
          (item: any) => item.id === songId
        )

        if (existingIndex === -1) {
          const newPlayList = [...playSongList, safeSong]
          dispatch(changePlaySongListAction(newPlayList))
          dispatch(changePlaySongIndexAction(newPlayList.length - 1))
        } else {
          dispatch(changePlaySongIndexAction(existingIndex))
        }

        await dispatch(fetchCurrentSongAction(songId)).unwrap()
      } catch (error) {
        console.error('播放歌曲失败:', error)
      } finally {
        setLoading(false)
      }
    },
    [dispatch, loading, playSongList]
  )

  // 判断是否为音乐相关请求
  const isMusicRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    const musicKeywords = [
      '推荐',
      '歌',
      '音乐',
      '听',
      '播放',
      '歌手',
      '专辑',
      '歌单',
      '列表',
      '歌曲',
      '旋律',
      '节奏'
    ]
    return musicKeywords.some((keyword) => lowerMessage.includes(keyword))
  }, [])

  // 判断是否为歌单相关请求
  const isPlaylistRequest = useCallback((message: string): boolean => {
    const lowerMessage = message.toLowerCase()
    return lowerMessage.includes('歌单') || lowerMessage.includes('列表')
  }, [])

  const sendMessage = useCallback(
    async (predefinedQuery?: string) => {
      const userMessage = predefinedQuery || input.trim()
      if (!userMessage || loading) return

      if (isVisitor()) {
        if (visitorMessageCount >= VISITOR_MESSAGE_LIMIT) {
          const limitMessage: MessageItem = {
            id: generateId(),
            role: 'assistant',
            content:
              '💡 游客模式下只能体验5次对话哦~ 请登录后继续使用完整功能！',
            options: ['立即登录']
          }
          setMessages((prev) => [...prev, limitMessage])
          setIsVisitorLimited(true)
          return
        }
        setVisitorMessageCount((prev) => prev + 1)
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setLoading(true)

      try {
        const musicRequest = isMusicRequest(userMessage)
        const playlistRequest = isPlaylistRequest(userMessage)

        let contextInfo = ''
        if (currentTime && weather) {
          contextInfo = `📅 ${currentTime.period} ${currentTime.season}季 | 🌤 ${weather.weather} ${weather.temperature}°C`
          if (currentTime.isWeekend) {
            contextInfo += ' | 🎉 周末愉快'
          }
        }

        if (playlistRequest) {
          const recommendedPlaylists = await fetchRecommendedPlaylists()

          const response: MessageItem = {
            id: generateId(),
            role: 'assistant',
            content: recommendedPlaylists.length
              ? `${contextInfo ? contextInfo + '\n\n' : ''}为你推荐以下精选歌单：`
              : '抱歉，暂时没有找到合适的歌单推荐',
            playlists: recommendedPlaylists.length
              ? recommendedPlaylists
              : undefined,
            options: ['推荐歌曲', '再推荐歌单', '聊聊天']
          }

          setMessages((prev) => [...prev, response])
        } else if (musicRequest) {
          const keywords = [
            '流行',
            '摇滚',
            '民谣',
            '古典',
            '电子',
            '爵士',
            'R&B',
            '嘻哈',
            '古风',
            '粤语'
          ]

          const foundKeyword = keywords.find((keyword) =>
            userMessage.includes(keyword)
          )

          let recommendedSongs: SongItem[] = []
          let recommendationReason = ''

          if (foundKeyword) {
            recommendationReason = `${contextInfo ? contextInfo + '\n\n' : ''}为你推荐一些${foundKeyword}风格的歌曲：`
            recommendedSongs = await fetchSongsByKeyword(foundKeyword)
          } else {
            recommendedSongs = await getSongsByContext()
            let sceneReason = ''

            if (currentTime && weather) {
              if (
                currentTime.period === '早晨' ||
                currentTime.period === '上午'
              ) {
                sceneReason = '晨间活力'
              } else if (currentTime.period === '中午') {
                sceneReason = '午间休闲'
              } else if (currentTime.period === '下午') {
                sceneReason = '午后专注'
              } else if (
                currentTime.period === '晚上' ||
                currentTime.period === '深夜'
              ) {
                sceneReason = '夜间放松'
              }

              if (weather.weather.includes('雨')) {
                sceneReason += ' · 雨天心情'
              } else if (weather.weather === '晴') {
                sceneReason += ' · 晴朗时光'
              }

              if (currentTime.isWeekend) {
                sceneReason += ' · 周末特推'
              }
            }

            recommendationReason = `${contextInfo ? contextInfo + '\n\n' : ''}为你推荐${sceneReason || '以下热门'}歌曲：`
          }

          const response: MessageItem = {
            id: generateId(),
            role: 'assistant',
            content: recommendedSongs.length
              ? recommendationReason
              : '抱歉，暂时没有找到合适的歌曲推荐',
            songs: recommendedSongs.length ? recommendedSongs : undefined,
            options: ['再推荐一些', '换其他风格', '推荐歌单', '聊聊天']
          }

          setMessages((prev) => [...prev, response])
        } else {
          // 普通聊天请求 - 使用AI聊天
          const aiResponse = await chatWithAI(
            userMessage,
            abortControllerRef.current?.signal
          )

          const response: MessageItem = {
            id: generateId(),
            role: 'assistant',
            content: aiResponse,
            options: ['推荐音乐', '推荐歌单', '继续聊天']
          }

          setMessages((prev) => [...prev, response])
        }
      } catch (error: any) {
        // 修复：添加类型检查
        if (error instanceof Error && error.name !== 'AbortError') {
          const errorMsg: MessageItem = {
            id: generateId(),
            role: 'assistant',
            content: '抱歉，处理请求时出现错误，请稍后再试',
            options: ['推荐音乐', '推荐歌单', '重新聊天']
          }

          setMessages((prev) => [...prev, errorMsg])
        }
      } finally {
        setLoading(false)
        abortControllerRef.current = null
        setInput('')
      }
    },
    [
      input,
      loading,
      currentTime,
      weather,
      isMusicRequest,
      isPlaylistRequest,
      getSongsByContext,
      fetchRecommendedPlaylists,
      fetchSongsByKeyword,
      isVisitor,
      visitorMessageCount
    ]
  )

  // 处理推荐选项点击
  const [loginVisible, setLoginVisible] = useState<boolean>(false)
  const handleOptionClick = useCallback(
    (option: string, e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      if (option === '立即登录') {
        setLoginVisible(true)
        return
      }

      if (isVisitor() && isVisitorLimited) {
        const limitMessage: MessageItem = {
          id: generateId(),
          role: 'assistant',
          content: '💡 游客模式下只能体验5次对话哦~ 请登录后继续使用完整功能！',
          options: ['立即登录']
        }
        setMessages((prev) => [...prev, limitMessage])
        return
      }

      let newQuery = ''
      switch (option) {
        case 'more':
          newQuery = '再推荐一些歌曲'
          break
        case 'other':
          newQuery = '推荐一些其他风格的歌曲'
          break
        case 'playlists':
          newQuery = '推荐一些歌单'
          break
        case 'chat':
          newQuery = '我们聊聊天吧'
          break
        case '立即登录':
          setLoginVisible(true)
          return
        default:
          newQuery = option
      }

      const userMessage: MessageItem = {
        id: generateId(),
        role: 'user',
        content: newQuery
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')

      setTimeout(() => {
        sendMessage(newQuery)
      }, 300)
    },
    [isVisitor, isVisitorLimited, sendMessage]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // 拖动相关函数
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const header = e.target.closest('.header')
      if (header) {
        setIsDragging(true)
        setDragOffset({
          x: e.clientX - position.x,
          y: e.clientY - position.y
        })
        e.preventDefault()
      }
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x
        const newY = e.clientY - dragOffset.y

        // 限制在窗口范围内
        const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 450))
        const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 650))

        setPosition({ x: boundedX, y: boundedY })
      }
    },
    [isDragging, dragOffset]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // 添加全局鼠标事件监听
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'grabbing'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  // 获取封面内容
  const getCoverContent = (url: string | undefined, alt: string) => {
    if (url) {
      const secureUrl = url.startsWith('http://')
        ? url.replace('http://', 'https://')
        : url

      return (
        <img
          src={getImageSize(secureUrl, 100)}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).src = default_album
          }}
        />
      )
    }
    return (
      <img
        src={default_album}
        alt="默认封面"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
    )
  }

  const removeMarkdownSymbols = (text: string): string => {
    if (!text) return text
    return text.replace(/\*\*/g, '')
  }

  const formatTimeDisplay = (time: TimeInfo) => {
    const now = new Date()
    return `${time.period} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  // 下载歌曲 - 只有用户上传的歌曲可以下载
  const handleDownloadSong = useCallback(
    (song: SongItem, e: React.MouseEvent) => {
      e.stopPropagation()

      if (!song.isUserUploaded) {
        message.info('只有用户上传的歌曲支持下载')
        return
      }

      if (!song.url) {
        message.error('歌曲文件不存在')
        return
      }

      const downloadWindow = window.open(
        `http://localhost:3001${song.url}`,
        '_blank'
      )

      if (!downloadWindow) {
        message.info('请在浏览器设置中允许弹窗，或右键链接另存为')
        const link = document.createElement('a')
        link.href = `http://localhost:3001${song.url}`
        link.download = `${song.name} - ${song.artist}.mp3`
        link.click()
      }
    },
    []
  )

  // 分享歌曲 - 只有用户上传的歌曲可以分享
  const handleShareSong = useCallback((song: SongItem, e: React.MouseEvent) => {
    e.stopPropagation()

    if (!song.isUserUploaded) {
      message.info('只有用户上传的歌曲支持分享')
      return
    }

    // 打开分享模态框
    setCurrentSharingSong(song)
    setShareModalVisible(true)
  }, [])

  // 处理分享成功
  const handleShareSuccess = () => {
    message.success('分享成功！')
  }

  // 关闭分享模态框
  const handleCloseShareModal = () => {
    setShareModalVisible(false)
    setCurrentSharingSong(null)
  }

  return (
    <>
      <ToggleButton onClick={() => setVisible(!visible)}>
        {visible ? '✕' : '💬'}
      </ToggleButton>

      {visible && (
        <ChatWindow
          position={position}
          isDragging={isDragging}
          onMouseDown={handleMouseDown}
        >
          <div className="header">
            <div className="avatar-container">
              <img
                src={aiAvatar}
                alt="AI助手头像"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="header-info">
              <div className="main-title">智能音乐助手</div>
              <div className="sub-title">
                {currentTime && (
                  <div className="time-info">
                    🕐 {formatTimeDisplay(currentTime)}
                  </div>
                )}
                {weather && (
                  <div className="weather-info">
                    🌤 {weather.weather} {weather.temperature}°C
                  </div>
                )}
              </div>
            </div>
            <span className="close-btn" onClick={() => setVisible(false)}>
              ✕
            </span>
          </div>

          <div className="messages-container">
            {isVisitor() && (
              <div className="visitor-notice-sticky">
                <div className="visitor-info">
                  🎵 游客模式 · 剩余
                  {VISITOR_MESSAGE_LIMIT - visitorMessageCount} 次对话
                  {isVisitorLimited && (
                    <span className="login-prompt">
                      <a href="/login" className="login-link">
                        立即登录
                      </a>
                      解锁完整功能
                    </span>
                  )}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <div className="avatar-container">
                  <img
                    src={
                      msg.role === 'user'
                        ? user?.avatar || defaultUserAvatar
                        : aiAvatar
                    }
                    alt={`${msg.role === 'user' ? '用户' : 'AI助手'}头像`}
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src =
                        msg.role === 'user' ? defaultUserAvatar : default_album
                    }}
                  />
                </div>
                <div className="message-bubble">
                  {removeMarkdownSymbols(msg.content)
                    .split('\n')
                    .map((line, index, array) => {
                      if (line === '' && index < array.length - 1) {
                        return <br key={index} />
                      }
                      return <div key={index}>{line || '\u00A0'}</div>
                    })}

                  {msg.songs && (
                    <div className="song-recommendations">
                      {msg.songs.map((song) => (
                        <div
                          key={song.id}
                          className="song-card"
                          onClick={(e) => handlePlaySong(song.id, song, e)}
                        >
                          <div className="song-cover">
                            {getCoverContent(
                              song.coverUrl || song.al?.picUrl,
                              song.name
                            )}
                            {/* 显示用户上传标识 */}
                            {song.isUserUploaded && (
                              <div
                                className="user-upload-badge"
                                title={`由 ${song.uploadUser?.name || '用户'} 上传`}
                              >
                                用户作品
                              </div>
                            )}
                          </div>
                          <div className="song-info">
                            <div className="song-name">
                              {song.name}
                              {song.isUserUploaded && (
                                <span className="user-upload-indicator">
                                  🎵
                                </span>
                              )}
                            </div>
                            <div className="song-artist">
                              {song.artist}
                              {song.isUserUploaded && (
                                <span className="user-upload-tag">
                                  · 由 {song.uploadUser?.name || '用户'} 上传
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="song-meta">
                            <div className="song-duration">
                              {song.duration
                                ? formatTime(song.duration)
                                : '00:00'}
                            </div>
                            {song.playCount && (
                              <div className="song-plays">
                                {formatCount(song.playCount)}播放
                              </div>
                            )}
                          </div>
                          {/* 只要是用户上传的歌曲就显示下载和分享按钮 */}
                          {song.isUserUploaded && (
                            <div className="song-actions">
                              <button
                                className="action-btn download-btn"
                                onClick={(e) => handleDownloadSong(song, e)}
                                title="下载歌曲"
                              >
                                <DownloadOutlined />
                              </button>
                              <button
                                className="action-btn share-btn"
                                onClick={(e) => handleShareSong(song, e)}
                                title="分享歌曲"
                              >
                                <ShareAltOutlined />
                              </button>
                            </div>
                          )}
                          <div className="play-indicator">▶</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.playlists && (
                    <div className="playlist-recommendations">
                      {msg.playlists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="playlist-card"
                          onClick={async () => {
                            try {
                              const detailData = await getPlaylistDetail(
                                playlist.id
                              )
                              const tracks = detailData?.playlist?.tracks || []

                              if (tracks.length > 0) {
                                dispatch(changePlaySongListAction(tracks))
                                dispatch(changePlaySongIndexAction(0))
                                dispatch(fetchCurrentSongAction(tracks[0].id))
                              }
                            } catch (error) {
                              console.error('播放歌单失败:', error)
                            }
                          }}
                        >
                          <div className="playlist-cover">
                            {getCoverContent(
                              playlist.coverImgUrl,
                              playlist.name || '未知歌单'
                            )}
                          </div>
                          <div className="playlist-info">
                            <div className="playlist-name">
                              {playlist.name || '未知歌单'}
                            </div>
                            <div className="playlist-meta">
                              {playlist.trackCount && (
                                <span>{playlist.trackCount}首</span>
                              )}
                              {playlist.playCount && (
                                <span>
                                  {formatCount(playlist.playCount)}播放
                                </span>
                              )}
                              {playlist.creator && (
                                <span>by {playlist.creator.nickname}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.options && (
                    <div className="options">
                      {msg.options.map((option, index) => (
                        <button
                          key={index}
                          className="option-btn"
                          onClick={(e) => handleOptionClick(option, e)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="message assistant">
                <LoadingIndicator>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </LoadingIndicator>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="可以聊天，也可以让我推荐音乐..."
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading}>
              →
            </button>
          </div>
        </ChatWindow>
      )}
      <ShareModal
        visible={shareModalVisible}
        song={currentSharingSong}
        onClose={handleCloseShareModal}
        onShare={handleShareSuccess}
      />
      <Login visible={loginVisible} onClose={() => setLoginVisible(false)} />
    </>
  )
}

export default OllamaChat
