const pool = require('./userService').pool;

module.exports = {
  async redeemCoupon(userId, couponId, quantity) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1. 校验用户积分
      const [user] = await connection.execute(
        'SELECT points FROM users WHERE id = ? FOR UPDATE',
        [userId]
      );
      const currentPoints = user[0].points;

      // 2. 获取优惠券信息
      const [coupon] = await connection.execute(
        'SELECT * FROM coupons WHERE id = ? AND stock >= ? AND expire_date > NOW()',
        [couponId, quantity]
      );
      if (!coupon.length) throw { code: 'INSUFFICIENT_POINTS', message: '优惠券不可用' };

      const requiredPoints = coupon[0].points_required * quantity;
      if (currentPoints < requiredPoints) {
        throw { 
          code: 'INSUFFICIENT_POINTS',
          message: '积分不足',
          details: { required_points: requiredPoints, available_points: currentPoints }
        };
      }

      // 3. 扣除积分
      await connection.execute(
        'UPDATE users SET points = points - ? WHERE id = ?',
        [requiredPoints, userId]
      );

      // 4. 减少库存并生成优惠券
      await connection.execute(
        'UPDATE coupons SET stock = stock - ? WHERE id = ?',
        [quantity, couponId]
      );
      const couponCode = `CODE-${Date.now()}-${userId}`;
      await connection.execute(
        'INSERT INTO user_coupons (user_id, coupon_id, code, expire_date) VALUES (?, ?, ?, ?)',
        [userId, couponId, couponCode, coupon[0].expire_date]
      );

      // 5. 记录流水
      await connection.execute(
        'INSERT INTO points_history (user_id, type, amount, source) VALUES (?, "redeem", ?, ?)',
        [userId, -requiredPoints, `兑换优惠券 ${couponId}`]
      );

      await connection.commit();

      return {
        coupon_code: couponCode,
        remaining_points: currentPoints - requiredPoints,
        coupon_expire: coupon[0].expire_date
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
};