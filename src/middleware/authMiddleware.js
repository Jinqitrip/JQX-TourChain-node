const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/auth');

module.exports = {
  authenticateToken: (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ code: 401, message: '未授权' });

    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.status(403).json({ code: 403, message: '令牌无效' });
      req.user = user;
      next();
    });
  }
};