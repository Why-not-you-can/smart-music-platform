# Smart Music Platform · AI 音乐分享平台

> 面向音乐爱好者的全栈音乐平台。在传统音乐网站基础上引入 AI 能力：
> 创作者可上传原创歌曲入库，AI 助手负责把作品推荐给合适的听众，帮助原创音乐推广。

![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178c6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/MySQL-8-4479a1?logo=mysql)
![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?logo=ollama)

<!-- 🖼️ 截图放这里：建议首页 Banner + 播放器 + AI 对话页 三张拼图，或一段演示 GIF -->

## ✨ 功能特性

- 🎵 **完整播放器**：播放 / 暂停 / 上一首 / 下一首 / 进度条拖拽 / 播放模式切换 / 歌词滚动 / 播放列表管理
- 🌊 **音频可视化**：基于 audiomotion-analyzer 的实时频谱动画
- 🏠 **发现页**：推荐、排行榜、歌单、歌手、新碟上架、电台 多个子页面
- 🔍 **搜索**：多类型搜索（单曲 / 歌手 / 歌单 / 专辑）+ 输入下拉建议
- 👤 **用户系统**：注册登录（JWT 鉴权 + bcrypt 密码加密）、个人中心、头像上传
- 📤 **原创音乐上传**：上传 MP3，服务端自动解析歌曲元数据（music-metadata / node-id3）入库
- 🤖 **AI 音乐助手**：基于 Ollama 本地大模型，智能推荐歌曲、向用户推广平台原创音乐

## 🛠 技术栈

| 端 | 技术 |
| --- | --- |
| 前端 | React 19、TypeScript、React Router、Zustand / Redux Toolkit、axios、styled-components、Less、Ant Design |
| 后端 | Node.js、Express、MySQL（mysql2）、Multer（文件上传）、JWT、bcrypt |
| AI | Ollama 本地大模型 |
| 工程化 | CRACO（定制 webpack）、ESLint、Prettier、http-proxy-middleware（开发代理解决跨域） |
| 数据 | 自建 MySQL 库（用户 / 歌曲 / 歌单）+ 网易云音乐 API（在线曲库） |

## 🚀 本地运行

**环境要求**：Node.js ≥ 18、MySQL 8、Ollama

```bash
# 1. 克隆项目
git clone https://github.com/Why-not-you-can/smart-music-platform.git
cd smart-music-platform

# 2. 安装依赖（前端 + 后端）
npm install
cd mysql && npm install && cd ..

# 3. 初始化数据库
# 在 MySQL 中创建数据库（建表 SQL 见 TODO：把你的建表语句导出放在 mysql/ 目录下）
# 并修改 mysql/server.js 中的数据库连接配置

# 4. 启动 Ollama 并拉取模型（AI 对话功能需要）
ollama pull <你的模型名>   # 例如 qwen2.5:7b
ollama serve

# 5. 一键启动（同时启动后端 server.js 与前端，支持热更新）
npm start
```

浏览器访问 http://localhost:3000

## 📁 目录结构

```
├── craco.config.js          # CRACO 构建配置
├── mysql/
│   ├── server.js            # Express 后端：用户 / 上传 / 音乐资源接口
│   └── uploads/             # 上传的音乐与头像文件
└── src/
    ├── components/          # 通用组件（播放器栏、音频可视化、分页、搜索下拉等）
    ├── context/             # 用户登录态 Context（JWT）
    ├── router/              # 路由配置
    ├── service/             # axios 封装与接口层
    ├── setupProxy.ts        # 开发环境代理（网易云 API 跨域）
    ├── store/               # 状态管理（播放器 / 登录态）
    ├── utils/               # 工具函数（歌词解析、时间格式化等）
    └── views/               # 页面
        ├── discover/        # 发现页（推荐 / 排行榜 / 歌单 / 歌手 / 新碟 / 电台）
        ├── player/          # 播放器（底部播放条 + 歌词面板 + 播放列表）
        ├── playlist/        # 歌单详情
        ├── search/          # 搜索
        ├── songslist/       # 歌曲列表
        ├── login/           # 登录注册
        ├── mine/            # 我的
        ├── personal/        # 个人中心
        └── ollama-chat/     # AI 音乐助手
```

## 🔌 接口设计

- 后端基于 Express 提供 RESTful 接口：用户注册 / 登录（JWT）、音乐文件上传（Multer）、用户信息、原创歌曲管理
- 前端开发环境通过 `http-proxy-middleware` 将 `/api` 代理至网易云音乐 API，解决跨域并统一接口前缀
- 上传歌曲由服务端解析 MP3 元数据（歌名 / 歌手 / 封面 / 时长）后写入 MySQL

## 📌 后续规划

- [ ] 部署在线 Demo（前端 + 后端 + Ollama 分离部署）
- [ ] AI 推荐策略优化（结合用户播放历史）
- [ ] 单元测试与 CI

## 📄 说明

本项目为个人毕业设计，仅供学习交流，不作为商业用途。在线曲库数据来自公开的网易云音乐 API。
