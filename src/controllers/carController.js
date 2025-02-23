const carService = require('../services/carService');
const { handleError } = require('./authController');

module.exports = {
  async getCarList(req, res) {
    try {
      const { city, service_type, date } = req.query;
      const data = await carService.getCarList(city, service_type, date);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};