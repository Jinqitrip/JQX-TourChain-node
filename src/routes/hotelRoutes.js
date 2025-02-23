const router = require('express').Router();
const { check } = require('express-validator');
const hotelController = require('../controllers/hotelController');

// 酒店列表查询
router.get('/get', 
  [
    check('brand').optional().isString().withMessage('品牌名称必须是字符串'),
    check('region').optional().isString().withMessage('地区名称必须是字符串'),
    check('sort').optional()
      .isIn(['rating_desc', 'rating_asc'])
      .withMessage('排序方式必须是 rating_desc 或 rating_asc')
  ],
  hotelController.getHotels
);

// 酒店搜索
router.get('/search', 
  [
    check('keyword').notEmpty().withMessage('关键词不能为空'),
    check('city').optional().isString().withMessage('城市名称必须是字符串'),
    check('sort').optional()
      .isIn(['rating_desc', 'rating_asc'])
      .withMessage('排序方式必须是 rating_desc 或 rating_asc')
  ],
  hotelController.searchHotels
);

module.exports = router;