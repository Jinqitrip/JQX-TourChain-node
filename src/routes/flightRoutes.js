const router = require('express').Router();
const { check } = require('express-validator');
const flightController = require('../controllers/flightController');

// 机票价格日历查询
router.get('/calendar', 
  [
    check('departure').notEmpty(),
    check('arrival').notEmpty(),
    check('cabin').optional().isIn(['economy', 'business'])
  ],
  flightController.getPriceCalendar
);

// 具体航班查询
router.post('/search', 
  [
    check('departure').notEmpty(),
    check('arrival').notEmpty(),
    check('date').isISO8601(),
    check('cabin').optional().isIn(['economy', 'business'])
  ],
  flightController.searchFlights
);

module.exports = router;