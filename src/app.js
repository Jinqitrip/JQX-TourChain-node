const express = require('express');
const app = express();
const port = 1145;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const carRoutes = require('./routes/carRoutes');
const flightRoutes = require('./routes/flightRoutes');
const buddyRoutes = require('./routes/buddyRoutes');
const guideRoutes = require('./routes/guideRoutes');
const orderRoutes = require('./routes/orderRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const configRoutes = require('./routes/configRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const routeRoutes = require('./routes/routeRoutes');
const supportRoutes = require('./routes/supportRoutes');

app.use('/v1/auth', authRoutes);
app.use('/v1/hotels', hotelRoutes);
app.use('/v1/membership', membershipRoutes);
app.use('/v1/cars', carRoutes);
app.use('/v1/flights', flightRoutes);
app.use('/v1/buddies', buddyRoutes);
app.use('/v1/guides', guideRoutes);
app.use('/v1/orders', orderRoutes);
app.use('/v1/recommendations', recommendationRoutes);
app.use('/v1/config', configRoutes);
app.use('/v1/notifications', notificationRoutes);
app.use('/v1/routes', routeRoutes);
app.use('/v1/support', supportRoutes);

// 测试端点
app.post('/', (req, res) => {
  res.json(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});