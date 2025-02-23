const router = require('express').Router();
const { check } = require('express-validator');
const configController = require('../controllers/configController');

router.get('/version', 
  [
    check('platform').isIn(['android', 'ios'])
  ],
  configController.checkVersion
);

module.exports = router;