const router = require('express').Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// 注册
router.post('/register', [
  check('mobile').isMobilePhone('zh-CN'),
  check('sms_code').isLength({ min: 6, max: 6 }),
  check('password').notEmpty()
], authController.register);

// 登录
router.post('/login', [
  check('type').isIn(['password', 'sms']),
  check('username').if(check('type').equals('password')).notEmpty(),
  check('password').if(check('type').equals('password')).notEmpty(),
  check('mobile').if(check('type').equals('sms')).isMobilePhone('zh-CN'),
  check('sms_code').if(check('type').equals('sms')).isLength(6)
], authController.login);

// 刷新令牌
router.post('/refresh', authController.refresh);

// 获取用户信息
router.get('/getUserByToken', authenticateToken, authController.getUserByToken);

// 修改密码
router.post('/password', [
  authenticateToken,
  check('old_password').notEmpty(),
  check('new_password').notEmpty(),
  check('sms_code').isLength(6)
], authController.updatePassword);

// 发送短信
router.post('/sms', [
  check('mobile').matches(/^1[3-9]\d{9}$/)
], authController.sendSms);

// 微信登录
router.post('/wxLogin', authController.wxLogin);

module.exports = router;