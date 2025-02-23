const router = require('express').Router();
const { check } = require('express-validator');
const carController = require('../controllers/carController');

// 车辆服务查询
router.get('/list', 
  [
    check('city').notEmpty().withMessage('城市不能为空'),
    check('service_type').optional().isIn(['拼车', '包车']),
    check('date').optional().isISO8601()
  ],
  carController.getCarList
);

module.exports = router;