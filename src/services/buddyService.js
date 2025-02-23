const pool = require('./userService').pool;

module.exports = {
  async submitRequirement(userId, requirement) {
    // 生成唯一匹配ID
    const matchId = `BUDDY_${Date.now().toString(36)}_${userId.slice(0, 4)}`;
    // 模拟企业微信群链接
    const groupChatUrl = `weixin://groupchat/join?invite=${matchId}`;

    // 存储到数据库（示例）
    await pool.execute(
      'INSERT INTO buddy_requirements (user_id, match_id, destination, start_date, people_num, budget, interests) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, matchId, requirement.destination, requirement.start_date, requirement.people_num, requirement.budget, JSON.stringify(requirement.interests)]
    );

    return { match_id: matchId, group_chat_url: groupChatUrl };
  },

  async getPosts(page, pageSize, destination) {
    const offset = (page - 1) * pageSize;
    let query = 'SELECT * FROM buddy_posts';
    let params = [];
    
    if (destination) {
      query += ' WHERE destination LIKE ?';
      params.push(`%${destination}%`);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(pageSize, offset);

    const [posts] = await pool.execute(query, params);
    const [total] = await pool.execute('SELECT COUNT(*) AS total FROM buddy_posts' + (destination ? ' WHERE destination LIKE ?' : ''), destination ? [`%${destination}%`] : []);

    return {
      total: total[0].total,
      list: posts.map(post => ({
        post_id: post.post_id,
        title: post.title,
        author: post.author,
        destination: post.destination,
        start_date: post.start_date,
        view_count: post.view_count
      }))
    };
  }
};