const configService = require('../services/configService');
const { handleError } = require('./authController');

module.exports = {
  async checkVersion(req, res) {
    try {
      const { platform } = req.query;
      const data = await configService.getVersionInfo(platform);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};