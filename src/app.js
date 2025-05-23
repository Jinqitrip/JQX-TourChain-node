const express = require('express');
const app = express();
var https = require('https');
const fs = require("fs");
const port = 1919;

const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {KEY_PATH,PEM_PATH} = require('../setting.js');
const license = {
  key: fs.readFileSync(KEY_PATH),
  cert: fs.readFileSync(PEM_PATH)
};

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// 连接MongoDB
mongoose.connect('mongodb://localhost:27017/bookingDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 订单状态枚举
const OrderStatus = {
  PENDING: 'pending',
  SELECTING: 'selecting',
  UPCOMING: 'upcoming',
  REVIEWING: 'reviewing',
  COMPLETED: 'completed'
};

// 订单模型
const orderSchema = new mongoose.Schema({
  openID: { type: String, required: true, index: true },
  guideID: String,
  title: String,
  price: Number,
  location: String,
  data: {
    date: String,
    time: String,
    people: Number,
    special_tags: [String],
    note: String
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 中间件：检查用户未完成订单
const checkActiveOrder = async (req, res, next) => {
  try {
    const activeOrder = await Order.findOne({
      openID: req.body.openID,
      status: { $ne: OrderStatus.COMPLETED }
    });

    if (activeOrder) {
      return res.status(401).json({
        error: 'Active order exists, please complete current order first'
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// 创建订单API端点
app.post('/v1/orders', checkActiveOrder, async (req, res) => {
  try {
    // 验证必要字段
    if (!req.body.openID || !req.body.data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 创建新订单
    const newOrder = new Order({
      openID: req.body.openID,
      data: req.body.data,
      status: OrderStatus.PENDING
    });

    // 保存到数据库
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: savedOrder._id
    });

  } catch (error) {
    handleError(res, error);
  }
});

// 获取订单
app.get('/v1/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    handleError(res, error);
  }
});

// 获取订单状态
app.get('/v1/orders/:orderId/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ status: order.status });
  } catch (error) {
    handleError(res, error);
  }
});

// 更新订单状态
app.patch('/v1/orders/:orderId/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // 强制转为小写并验证
    const newStatus = req.body.status?.toLowerCase();
    if (!newStatus || !Object.values(OrderStatus).includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // 状态转换逻辑
    if (order.status === OrderStatus.SELECTING &&
      newStatus === OrderStatus.UPCOMING &&
      !req.body.guideID) {
      return res.status(400).json({ error: 'Guide ID required' });
    }

    // 更新字段
    order.status = newStatus;
    if (req.body.guideID) order.guideID = req.body.guideID;
    if (req.body.location) order.location = req.body.location;
    if (req.body.price) order.price = req.body.price;
    if (req.body.title) order.title = req.body.title;

    await order.save();
    console.log('Saved Order:', order); // 关键日志

    res.json({ message: `Order status updated to ${newStatus} successfully` });
  } catch (error) {
    handleError(res, error); // 确保捕获所有错误
  }
});

// 获取用户所有订单
app.get('/v1/orders/user/:openID', async (req, res) => {
  try {
    const orders = await Order.find({ openID: req.params.openID })
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    handleError(res, error);
  }
});

// 获取用户当前未完成订单
app.get('/v1/orders/user/:openID/active', async (req, res) => {
  try {
    const activeOrder = await Order.findOne({
      openID: req.params.openID,
      status: { $ne: OrderStatus.COMPLETED }
    }).sort({ createdAt: -1 }); // 按创建时间倒序获取最新的

    if (!activeOrder) {
      return res.status(404).json({ message: 'No active orders found' });
    }

    res.json(activeOrder);
  } catch (error) {
    handleError(res, error);
  }
});

// 错误处理函数
function handleError(res, error) {
  console.error(error);
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: 'Internal server error' });
}

const server = https.createServer(license, app);
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})