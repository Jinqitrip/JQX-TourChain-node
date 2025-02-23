const routeService = require('../services/routeService');
const { handleError } = require('./authController');

module.exports = {
  async getRegionRecommendations(req, res) {
    try {
      const { region, sort } = req.query;
      const data = await routeService.getRecommendationsByRegion(region, sort);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getDestinationRecommendations(req, res) {
    try {
      const { destination, sort } = req.query;
      const data = await routeService.getRecommendationsByDestination(destination, sort);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async submitCustomRoute(req, res) {
    try {
      const userId = req.user.sub;
      const { description } = req.body;
      const data = await routeService.submitCustomRequest(userId, description);
      res.status(200).json({ code: 200, message: '需求已提交，客服将在5分钟内联系', data });
    } catch (error) {
      handleError(res, error);
    }
  }
};