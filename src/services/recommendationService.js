const pool = require('./userService').pool;

module.exports = {
  async getRecommendations(userId, category, limit) {
    const [history] = await pool.execute(
      'SELECT resource_id, type FROM user_actions WHERE user_id = ? AND action_type IN ("order", "favorite")',
      [userId]
    );

    // 示例逻辑：随机推荐酒店
    const [resources] = await pool.execute(
      'SELECT id AS resource_id, name, cover_img FROM hotels LIMIT ?',
      [limit]
    );

    return resources.map(res => ({
      type: 'hotel',
      resource_id: res.resource_id,
      name: res.name,
      reason: '根据您的历史偏好推荐',
      cover_img: res.cover_img
    }));
  }
};