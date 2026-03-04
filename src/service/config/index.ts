let BASE_URL = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境：使用代理
  BASE_URL = 'https://apis.netstart.cn/music'
  // BASE_URL = 'http://123.207.32.32:9002'
  // BASE_URL = 'http://codercba.com:9002'
  // BASE_URL = 'https://163api.qijieya.cn'
} else {
  // 生产环境
  BASE_URL = '生产环境接口地址'
}
export const TIME_OUT = 10000
export { BASE_URL }
