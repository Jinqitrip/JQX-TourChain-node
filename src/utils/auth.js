const jwt = require('jsonwebtoken');

const SECRET = 'ni_de_tou_zen_me_jian_jian_de';
const REFRESH_SECRET = 'na_wo_wen_ni_wo_tou_jian_jian_de_zen_me_le';

module.exports = {
  generateToken: (userId) => jwt.sign({ sub: userId }, SECRET, { expiresIn: '1h' }),
  generateRefreshToken: (userId) => jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '7d' })
};