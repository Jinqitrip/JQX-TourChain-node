const guideService = require('../services/guideService');
const { handleError } = require('./authController');

module.exports = {
  async getGuideList(req, res) {
    try {
      const { city, tags } = req.query;
      const data = await guideService.getGuideList(city, JSON.parse(tags || '[]'));
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};