const router = require('express').Router();
const { check } = require('express-validator');
const guideController = require('../controllers/guideController');

// 导游列表查询
router.get('/list', 
  [
    check('city').notEmpty(),
    check('tags').optional().isArray()
  ],
  guideController.getGuideList
);

module.exports = router;