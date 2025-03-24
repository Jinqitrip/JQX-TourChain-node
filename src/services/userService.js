const client = require('../config/redis');
const mysql = require('mysql2/promise'); // 使用mysql2库的Promise版本
const bcrypt = require('bcrypt'); // 使用bcrypt库进行密码哈希

// 创建MySQL连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'app-server',
  password: 'zKm3hdAELdHHNes2',
  database: 'app-server',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = {
  // 创建用户，密码使用bcrypt进行哈希
  async createUser(mobile, password) {
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
      'INSERT INTO users (mobile, password_hash) VALUES (?, ?)',
      [mobile, hashedPassword]
    );

    return { id: result.insertId.toString(), mobile };
  },

  // 获取用户信息
  async getUserById(userId) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) {
      return null; // 用户不存在
    }
    return rows[0];
  },

  // 检查用户密码是否正确
  async checkUserCredentials(userId, password) {
    const user = await getUserById(userId);
    if (!user) {
      return false; // 用户不存在
    }
    return await bcrypt.compare(password, user.password_hash);
  },

  // 更新用户密码
  async updateUserPassword(userId, newPassword) {
    const saltRounds = 6;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    console.log(`更新用户 ${userId} 的密码`);
  }


};