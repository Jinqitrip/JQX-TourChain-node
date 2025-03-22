const pool = require('./userService').pool;

module.exports = {
  async getNotifications(userId, status, page, pageSize) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params = [userId];

    if (status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [messages] = await pool.execute(query, params);
    const [total] = await pool.execute(
      'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ?' + (status !== 'all' ? ' AND status = ?' : ''),
      status !== 'all' ? [userId, status] : [userId]
    );

    return {
      total: total[0].total,
      list: messages.map(msg => ({
        id: msg.id,
        title: msg.title,
        content: msg.content,
        type: msg.type,
        created_time: msg.created_time
      }))
    };
  }
};