const express = require('express')
const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const mm = require('music-metadata')
const jwt = require('jsonwebtoken')

const app = express()
app.use(express.json())
app.use(cors())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'User',
  port: 3306,
  charset: 'utf8mb4',
  connectTimeout: 2000
}

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

async function getAudioDuration(filePath) {
  try {
    const metadata = await mm.parseFile(filePath)
    return metadata.format.duration || 0
  } catch (error) {
    return 0
  }
}

function isLikelyArtistName(str) {
  if (!str) return false
  const artistIndicators = [
    /^[A-Z][a-z]+\s+[A-Z][a-z]+$/,
    /^[A-Z][a-z]+$/,
    /^[\u4e00-\u9fa5]{2,4}$/,
    /^[\u4e00-\u9fa5]+·[\u4e00-\u9fa5]+$/,
    /(乐队|组合|乐团|crew|band)$/i
  ]

  return artistIndicators.some((pattern) => pattern.test(str))
}

// 简化头像上传配置
const uploadAvatar = multer({
  dest: 'uploads/avatars/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('只允许上传图片文件'), false)
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

app.post(
  '/api/upload/avatar',
  uploadAvatar.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.json({
          success: false,
          message: '请选择头像文件'
        })
      }
      const { userId } = req.body
      if (!userId) {
        return res.json({
          success: false,
          message: '用户ID不能为空'
        })
      }
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const ext = path.extname(req.file.originalname)
      const filename = `avatar-${userId}-${uniqueSuffix}${ext}`
      const avatarUrl = `/uploads/avatars/${filename}`
      const oldPath = req.file.path
      const newPath = path.join(path.dirname(oldPath), filename)
      fs.renameSync(oldPath, newPath)

      let connection
      try {
        connection = await mysql.createConnection(dbConfig)

        const [result] = await connection.execute(
          'UPDATE users SET avatar = ? WHERE id = ?',
          [avatarUrl, parseInt(userId)]
        )

        if (result.affectedRows === 0) {
          return res.json({
            success: false,
            message: '更新头像失败'
          })
        }

        res.json({
          success: true,
          message: '头像上传成功',
          avatarUrl: avatarUrl
        })
      } catch (dbError) {
        console.error('💥 数据库错误:', dbError)
        throw dbError
      } finally {
        if (connection) {
          await connection.end()
        }
      }
    } catch (error) {
      res.json({
        success: false,
        message: '头像上传失败: ' + error.message
      })
    }
  }
)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/music')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const decodedName = Buffer.from(file.originalname, 'latin1').toString(
      'utf8'
    )
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + decodedName)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true)
  } else {
    cb(new Error('只允许上传音频文件'), false)
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ success: false, message: '未登录' })

  jwt.verify(token, 'simple-secret-key', (err, user) => {
    if (err)
      return res.status(403).json({
        success: false,
        message:
          err.name === 'TokenExpiredError' ? '登录过期，请重新登录' : '令牌无效'
      })
    req.user = user
    next()
  })
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 注册接口
app.post('/api/register', async (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  // 验证输入
  if (!username || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: '所有字段都是必填的' })
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: '两次输入的密码不一致' })
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: '密码长度至少6位' })
  }

  let connection
  try {
    connection = await mysql.createConnection(dbConfig)

    // 检查用户名和邮箱是否已存在
    const [existingUsers] = await connection.execute(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    )

    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0]
      if (existingUser.username === username) {
        return res.status(400).json({ success: false, message: '用户名已存在' })
      }
      if (existingUser.email === email) {
        return res.status(400).json({ success: false, message: '邮箱已被注册' })
      }
    }

    // 加密密码
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // 插入新用户
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    )

    res.json({
      success: true,
      message: '注册成功！',
      userId: result.insertId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// 登录接口
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: '用户名和密码是必填的' })
  }

  let connection
  try {
    connection = await mysql.createConnection(dbConfig)
    const [users] = await connection.execute(
      'SELECT id, username, email, avatar, password FROM users WHERE username = ? OR email = ?',
      [username, username]
    )

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: '用户不存在' })
    }

    const user = users[0]

    // 密码验证
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: '密码错误' })
    }
    const token = jwt.sign({ userId: user.id }, 'simple-secret-key', {
      expiresIn: '2h'
    })
    res.json({
      success: true,
      message: '登录成功！',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
          ? `http://localhost:3001${user.avatar}`
          : user.avatar
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// 上传音乐文件
app.post(
  '/api/upload',
  authenticateToken,
  upload.single('music'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.json({
          success: false,
          message: '请选择音乐文件'
        })
      }

      const userId = req.user.userId

      if (!userId) {
        return res.json({
          success: false,
          message: '用户ID不能为空'
        })
      }
      const audioDuration = await getAudioDuration(req.file.path)
      const formattedDuration = formatDuration(audioDuration)

      // 正确解析文件名
      const decodedFileName = Buffer.from(
        req.file.originalname,
        'latin1'
      ).toString('utf8')
      const fileNameWithoutExt = decodedFileName.replace(/\.mp3$/i, '')
      let artist, title
      const patterns = [
        { regex: /^(.*)\s+-\s+(.*)$/, artistIndex: 1, titleIndex: 2 },
        { regex: /^(.*)\s+-\s+(.*)$/, artistIndex: 2, titleIndex: 1 },
        { regex: /^(.*)-(.*)$/, artistIndex: 1, titleIndex: 2 },
        { regex: /^(.*)-(.*)$/, artistIndex: 2, titleIndex: 1 }
      ]

      let parsed = false
      for (const pattern of patterns) {
        const match = fileNameWithoutExt.match(pattern.regex)
        if (match && match[pattern.artistIndex] && match[pattern.titleIndex]) {
          artist = match[pattern.artistIndex].trim()
          title = match[pattern.titleIndex].trim()

          if (artist.length >= 2 && title.length >= 2) {
            parsed = true
            break
          }
        }
      }

      if (!parsed) {
        const lastDashIndex = fileNameWithoutExt.lastIndexOf('-')
        if (lastDashIndex !== -1) {
          const part1 = fileNameWithoutExt.substring(0, lastDashIndex).trim()
          const part2 = fileNameWithoutExt.substring(lastDashIndex + 1).trim()
          if (isLikelyArtistName(part2)) {
            title = part1
            artist = part2
          } else if (isLikelyArtistName(part1)) {
            title = part2
            artist = part1
          } else {
            title = fileNameWithoutExt
            artist = '未知艺术家'
          }
        } else {
          title = fileNameWithoutExt
          artist = '未知艺术家'
        }
      }

      // 设置默认封面
      const defaultCovers = [
        'https://p1.music.126.net/t3ogpTd1bIJpwokhkpBtwQ==/109951169829246225.jpg'
      ]
      const randomCover =
        defaultCovers[Math.floor(Math.random() * defaultCovers.length)]

      let connection
      try {
        connection = await mysql.createConnection(dbConfig)
        await connection.execute('SET NAMES utf8mb4')
        const [users] = await connection.execute(
          'SELECT username FROM users WHERE id = ?',
          [userId]
        )
        const username = users[0]?.username || '未知用户'
        const [result] = await connection.execute(
          `INSERT INTO songs (title, artist, duration, size, url, cover, user_id, username, upload_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            title,
            artist,
            formattedDuration, // 使用真实的格式化时长
            formatFileSize(req.file.size),
            `/uploads/music/${req.file.filename}`,
            randomCover,
            userId,
            username
          ]
        )

        const [songs] = await connection.execute(
          'SELECT * FROM songs WHERE id = ?',
          [result.insertId]
        )

        const song = songs[0]

        res.json({
          success: true,
          message: '上传成功',
          song: {
            id: song.id,
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            size: song.size,
            uploadTime: song.upload_time,
            url: song.url,
            cover: song.cover
          }
        })
      } catch (dbError) {
        console.error('💥 数据库错误:', dbError)
        throw dbError
      } finally {
        if (connection) {
          await connection.end()
        }
      }
    } catch (error) {
      res.json({
        success: false,
        message: '上传失败: ' + error.message
      })
    }
  }
)

// 获取用户上传的歌曲列表
app.get('/api/songs/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    let connection
    try {
      connection = await mysql.createConnection(dbConfig)

      // 先检查用户是否存在
      const [users] = await connection.execute(
        'SELECT * FROM users WHERE id = ?',
        [userId]
      )

      if (users.length === 0) {
        return res.json({
          success: false,
          message: '用户不存在'
        })
      }

      const [songs] = await connection.execute(
        'SELECT * FROM songs WHERE user_id = ? ORDER BY upload_time DESC',
        [userId]
      )

      const formattedSongs = songs.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        size: song.size,
        uploadTime: song.upload_time,
        url: song.url,
        cover: song.cover
      }))

      res.json({
        success: true,
        data: formattedSongs
      })
    } catch (dbError) {
      console.error('💥 数据库错误:', dbError)
      throw dbError
    } finally {
      if (connection) {
        await connection.end()
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: '获取歌曲列表失败: ' + error.message
    })
  }
})

// 删除歌曲
app.delete('/api/songs/:songId', authenticateToken, async (req, res) => {
  try {
    const { songId } = req.params
    let connection
    try {
      connection = await mysql.createConnection(dbConfig)

      const [result] = await connection.execute(
        'DELETE FROM songs WHERE id = ?',
        [songId]
      )

      if (result.affectedRows === 0) {
        return res.json({
          success: false,
          message: '歌曲不存在'
        })
      }

      res.json({
        success: true,
        message: '删除成功'
      })
    } catch (dbError) {
      console.error('💥 数据库错误:', dbError)
      throw dbError
    } finally {
      if (connection) {
        await connection.end()
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: '删除失败'
    })
  }
})

// 获取所有歌曲（用于测试）
app.get('/api/songs', async (req, res) => {
  try {
    let connection
    try {
      connection = await mysql.createConnection(dbConfig)

      const [songs] = await connection.execute(
        'SELECT * FROM songs ORDER BY upload_time DESC'
      )

      const formattedSongs = songs.map((song) => ({
        id: song.id,
        title: song.title,
        artist: song.artist,
        duration: song.duration,
        size: song.size,
        uploadTime: song.upload_time,
        url: song.url,
        cover: song.cover,
        userId: song.user_id,
        username: song.username
      }))

      res.json({
        success: true,
        data: formattedSongs
      })
    } catch (dbError) {
      console.error('💥 数据库错误:', dbError)
      throw dbError
    } finally {
      if (connection) {
        await connection.end()
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: '获取歌曲失败'
    })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
})
