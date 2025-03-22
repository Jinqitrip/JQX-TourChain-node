const client = require('../config/redis');

module.exports = {
    // 校验短信验证码
    async verifySmsCode(mobile, sms_code) {
        const redisKey = `sms:${mobile}`;
        if (client.get(redisKey) !== sms_code) {
            return false;
        } else {
            return true;
        }
    },


    // 模拟函数：发送短信验证码
    async sendSms(mobile, smsCode) {
        // 这里调用实际的第三方短信服务
        console.log(`发送验证码 ${smsCode} 到手机号 ${mobile}`);
    }

}