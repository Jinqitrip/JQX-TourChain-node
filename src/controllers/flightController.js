const flightService = require('../services/flightService');
const { handleError } = require('./authController');

module.exports = {
  async getPriceCalendar(req, res) {
    try {
      const { departure, arrival, cabin } = req.query;
      const data = await flightService.getPriceCalendar(departure, arrival, cabin);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  },

  async searchFlights(req, res) {
    try {
      const { departure, arrival, date, cabin } = req.body;
      const data = await flightService.searchFlights(departure, arrival, date, cabin);
      res.status(200).json({ code: 200, data });
    } catch (error) {
      handleError(res, error);
    }
  }
};