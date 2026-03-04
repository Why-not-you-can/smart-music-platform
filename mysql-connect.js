const mysql = require('mysql2/promise')
const dbConfig = {
  host: 'localhost', // 数据库地址
  user: 'root', // 用户名（默认 root）
  password: '123456', // 你的数据库密码
  database: 'User', // 数据库名称（需提前创建）
  port: 3306 // 端口（默认 3306）
}

async function queryDatabase() {
  let connection
  try {
    connection = await mysql.createConnection(dbConfig)
    console.log('MySQL 连接成功！')
    const [rows] = await connection.execute('SELECT VERSION() AS version')
    console.log('数据库版本：', rows[0].version)
  } catch (err) {
    console.error('连接或查询失败：', err.message)
  } finally {
    if (connection) {
      await connection.end()
      console.log('连接已关闭')
    }
  }
}
queryDatabase()
