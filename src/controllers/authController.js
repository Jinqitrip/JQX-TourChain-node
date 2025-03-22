// src/controllers/authController.js
const userService = require('../services/userService.js');
const smsService = require('../services/smsService.js');
const { generateToken, generateRefreshToken } = require('../utils/auth');
const client = require('../config/redis');
const jwt = require('jsonwebtoken');
const { REFRESH_SECRET } = require('../utils/auth');
const {APPID, APPSECRET} = require('../../setting.js')
const axios = require('axios');


module.exports = {
  async register(req, res) {
    try {
      const { mobile, sms_code, password } = req.body;

      if (!await smsService.verifySmsCode(mobile, sms_code)) {
        return res.status(403).json({ code: 403, message: '短信验证码错误' });
      }

      const user = await userService.createUser(mobile, password);
      return res.status(201).json({
        code: 201,
        data: {
          user_id: user.id,
          token: generateToken(user.id),
          refresh_token: generateRefreshToken(user.id),
          is_new_user: true
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  async login(req, res) {
    try {
      const { type, username, password, mobile, sms_code } = req.body;
      let user;

      if (type === 'password') {
        user = await userService.checkUserCredentials(username, password);
        if (!user) {
          return res.status(401).json({ code: 401, message: '用户名或密码错误' });
        }
      } else if (type === 'sms') {
        if (!await smsService.verifySmsCode(mobile, sms_code)) {
          return res.status(401).json({ code: 401, message: '短信验证码错误' });
        }
        user = await userService.getUserByMobile(mobile);
        if (!user) {
          return res.status(404).json({ code: 404, message: '用户不存在' });
        }
      }

      return res.status(200).json({
        code: 200,
        data: {
          token: generateToken(user.id),
          expires_in: 3600,
          refresh_token: generateRefreshToken(user.id)
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  refresh(req, res) {
    try {
      const refresh_token = req.headers.authorization?.split(' ')[1];
      if (!refresh_token) {
        return res.status(401).json({ code: 401, message: '未提供刷新令牌' });
      }

      jwt.verify(refresh_token, REFRESH_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ code: 403, message: '无效的刷新令牌' });
        }

        return res.status(200).json({
          code: 200,
          data: {
            token: generateToken(decoded.sub),
            expires_in: 3600
          }
        });
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  async getUserByToken(req, res) {
    try {
      const user = await userService.getUserById(req.user.sub);
      if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }

      return res.status(200).json({
        code: 200,
        data: {
          id: user.id,
          username: user.username,
          mobile: user.mobile,
          nickname: user.nickname,
          avatar: user.avatar
        }
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  async updatePassword(req, res) {
    try {
      const { old_password, new_password, sms_code } = req.body;
      const userId = req.user.sub;
      const user = await userService.getUserById(userId);

      // 验证短信验证码
      if (!await smsService.verifySmsCode(user.mobile, sms_code)) {
        return res.status(403).json({ code: 403, message: '短信验证码错误' });
      }

      // 验证旧密码
      if (!await userService.checkUserCredentials(user.username, old_password)) {
        return res.status(403).json({ code: 403, message: '原密码错误' });
      }

      // 更新密码
      await userService.updateUserPassword(userId, new_password);

      // 删除验证码
      await client.del(`sms:${user.mobile}`);

      return res.status(200).json({ code: 200, message: '密码修改成功' });
    } catch (error) {
      handleError(res, error);
    }
  },

  async sendSms(req, res) {
    try {
      const { mobile } = req.body;
      const ip = req.ip;

      // 手机号限流
      const phoneKey = `sms:rate_limit:phone:${mobile}`;
      if (await client.get(phoneKey)) {
        return res.status(429).json({ code: 429, message: '请求过于频繁，请60秒后重试' });
      }

      // IP限流
      const ipKey = `sms:rate_limit:ip:${ip}`;
      const ipCount = await client.incr(ipKey);
      if (ipCount === 1) {
        await client.expire(ipKey, 3600);
      }
      if (ipCount > 10) {
        return res.status(429).json({ code: 429, message: '请求过于频繁，请1小时后重试' });
      }

      // 生成并发送验证码
      const smsCode = Math.floor(100000 + Math.random() * 900000).toString();
      await smsService.sendSms(mobile, smsCode);

      // 存储验证码，设置有效期为5分钟
      await client.set(`sms:${mobile}`, smsCode, { EX: 300 });

      await client.set(phoneKey, '1', { EX: 60 });

      return res.status(200).json({
        code: 200,
        message: '验证码已发送',
        data: { expire_in: 300 }
      });
    } catch (error) {
      handleError(res, error);
    }
  },

  async wxLogin(req, res) {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ success: false, message: '缺少code参数' });
      }
      
      const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${APPSECRET}&js_code=${code}&grant_type=authorization_code`;
      const response = await axios.get(url, { timeout: 5000 }); // 设置5秒超时
      
      const data = response.data;
      if (data.errcode) {
        return res.status(400).json({ success: false, message: data.errmsg });
      }
      
      return res.status(200).json({
        success: true,
        openId: data.openid,
        sessionKey: data.session_key,
        unionId: data.unionid
      });
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        return res.status(504).json({ success: false, message: '微信接口请求超时' });
      }
      handleError(res, error);
    }
  }
};

function handleError(res, error) {
  console.error(error);
  res.status(500).json({ code: 500, message: '服务器内部错误' });
}