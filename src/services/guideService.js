const pool = require('./userService').pool;

module.exports = {
  async getGuideList(city, tags) {
    let query = 'SELECT * FROM guides WHERE city = ?';
    const params = [city];

    if (tags.length > 0) {
      query += ' AND JSON_CONTAINS(tags, ?)';
      params.push(JSON.stringify(tags));
    }

    const [guides] = await pool.execute(query, params);
    return guides.map(guide => ({
      guide_id: guide.guide_id,
      name: guide.name,
      rating: guide.rating,
      experience: guide.experience,
      languages: JSON.parse(guide.languages),
      price_per_day: guide.price_per_day
    }));
  }
};