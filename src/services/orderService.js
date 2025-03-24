const pool = require('./userService').pool;

module.exports = {
  async createOrder(userId, orderData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 生成订单ID和过期时间
      const orderId = `ORD_${Date.now().toString(36)}`;
      const expireTime = new Date(Date.now() + 30 * 60 * 1000); // 30分钟后过期

      // 获取资源价格（示例）
      const [resource] = await connection.execute(
        'SELECT price FROM resources WHERE id = ?',
        [orderData.resource_id]
      );
      if (!resource.length) throw new Error('资源不存在');
      const amount = resource[0].price * orderData.quantity;

      // 插入订单
      await connection.execute(
        'INSERT INTO orders (order_id, user_id, type, resource_id, quantity, amount, expire_time, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [orderId, userId, orderData.type, orderData.resource_id, orderData.quantity, amount, expireTime, JSON.stringify(orderData.contact_info)]
      );

      await connection.commit();
      return { order_id: orderId, amount, expire_time: expireTime };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getOrderStatus(orderId, userId) {
    const [order] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );
    if (!order.length) throw { code: 'FORBIDDEN', message: '订单不存在或无权访问' };

    // 获取资源详细信息（示例）
    const [resource] = await pool.execute(
      'SELECT name, check_in_date FROM hotel_resources WHERE id = ?',
      [order[0].resource_id]
    );

    return {
      order_id: order[0].order_id,
      type: order[0].type,
      status: order[0].status,
      amount: order[0].amount,
      resource_info: resource[0] || {}
    };
  }
};