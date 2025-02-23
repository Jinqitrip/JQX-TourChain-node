const pool = require('./userService').pool;

module.exports = {
  async getMembershipLevel(userId) {
    // 假设用户等级信息存储在membership_levels表
    const [rows] = await pool.execute(`
      SELECT level_name AS current_level, level_code, expire_date, benefits 
      FROM membership_levels 
      WHERE user_id = ? 
      ORDER BY expire_date DESC 
      LIMIT 1
    `, [userId]);

    return rows[0] || {
      current_level: "黄金会员",
      level_code: "GOLD",
      expire_date: "2024-12-31",
      benefits: ["专属折扣", "免费早餐", "积分加速1.5倍"]
    };
  },

  async getPointsHistory(userId, page, pageSize) {
    const offset = (page - 1) * pageSize;

    // 查询总积分和即将过期积分
    const [totalResult] = await pool.execute(`
      SELECT 
        SUM(CASE WHEN expire_date > NOW() THEN amount ELSE 0 END) AS total_points,
        SUM(CASE WHEN expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY) THEN amount ELSE 0 END) AS expiring_soon
      FROM points_history 
      WHERE user_id = ?
    `, [userId]);

    // 分页查询流水
    const [history] = await pool.execute(`
      SELECT type, amount, source, time, expire_date 
      FROM points_history 
      WHERE user_id = ?
      ORDER BY time DESC
      LIMIT ? OFFSET ?
    `, [userId, pageSize, offset]);

    return {
      total_points: totalResult[0].total_points || 0,
      expiring_soon: totalResult[0].expiring_soon || 0,
      list: history
    };
  }
};