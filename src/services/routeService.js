const pool = require('./userService').pool;

module.exports = {
  async getRecommendationsByRegion(region, sort) {
    let query = 'SELECT * FROM routes WHERE region = ?';
    const params = [region];

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else {
      query += ' ORDER BY popularity DESC';
    }

    const [routes] = await pool.execute(query, params);
    return routes.map(route => ({
      id: route.id,
      title: route.title,
      days: route.days,
      price_range: route.price_range,
      tags: JSON.parse(route.tags),
      cover_img: route.cover_img
    }));
  },

  async getRecommendationsByDestination(destination, sort) {
    let query = 'SELECT * FROM routes WHERE destination = ?';
    const params = [destination];

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else {
      query += ' ORDER BY popularity DESC';
    }

    const [routes] = await pool.execute(query, params);
    return routes.map(route => ({
      id: route.id,
      title: route.title,
      days: route.days,
      price_range: route.price_range,
      tags: JSON.parse(route.tags),
      cover_img: route.cover_img
    }));
  },

  async submitCustomRequest(userId, description) {
    const serviceId = `SVC_${Date.now().toString(36)}`;
    await pool.execute(
      'INSERT INTO custom_requests (service_id, user_id, description) VALUES (?, ?, ?)',
      [serviceId, userId, description]
    );
    return { service_id: serviceId };
  }
};