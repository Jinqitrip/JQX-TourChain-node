const hotelService = require('../services/hotelService.js');

module.exports = {
  async getHotels(req, res) {
    try {
      const { brand, region, sort } = req.query;
      const hotels = await hotelService.getHotelsByCriteria(brand, region, sort);
      res.status(200).json({ code: 200, data: hotels });
    } catch (error) {
      handleError(res, error);
    }
  },

  async searchHotels(req, res) {
    try {
      const { keyword, city, sort } = req.query;
      const hotels = await hotelService.searchHotels(keyword, city, sort);
      res.status(200).json({ code: 200, data: hotels });
    } catch (error) {
      handleError(res, error);
    }
  }
};

function handleError(res, error) {
  console.error(error);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
}