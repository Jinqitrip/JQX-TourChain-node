const express = require('express');
const app = express();
const port = 1145;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/authRoutes');
//const guideRoutes = require('./routes/guideRoutes');
//const orderRoutes = require('./routes/orderRoutes');
//const configRoutes = require('./routes/configRoutes');
//const notificationRoutes = require('./routes/notificationRoutes');
//const supportRoutes = require('./routes/supportRoutes');

app.use('/v1/auth', authRoutes);
//app.use('/v1/guides', guideRoutes);
//app.use('/v1/orders', orderRoutes);
//app.use('/v1/config', configRoutes);
//app.use('/v1/notifications', notificationRoutes);
//app.use('/v1/support', supportRoutes);

// 测试端点
app.post('/', (req, res) => {
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});