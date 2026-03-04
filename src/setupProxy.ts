import { createProxyMiddleware } from 'http-proxy-middleware'
import type { Express } from 'express'

export default function (app: Express) {
  // 代理所有以 /api 开头的请求到后端接口
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://codercba.com:9002', // 后端接口地址
      changeOrigin: true, // 允许跨域
      pathRewrite: { '^/api': '' } // 去掉请求中的 /api 前缀
    })
  )
}
