const express = require('express');
const app = express();
const port = 1919;

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

// 连接MongoDB数据库（替换你的数据库连接字符串）
mongoose.connect('mongodb://localhost:27017/bookingDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 定义订单数据模型
const orderSchema = new mongoose.Schema({
  openID: { type: String, required: true },
  data: {
    date: { type: String, required: true },
    time: { type: String, required: true },
    people: { type: Number, required: true, min: 1 },
    special_tags: [String],
    note: String
  },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// 创建订单API端点
app.post('/api/orders', async (req, res) => {
  try {
    // 验证必要字段
    if (!req.body.openID || !req.body.data) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 创建新订单
    const newOrder = new Order({
      openID: req.body.openID,
      data: {
        date: req.body.data.date,
        time: req.body.data.time,
        people: req.body.data.people,
        special_tags: req.body.data.special_tags || [],
        note: req.body.data.note || ''
      }
    });

    // 保存到数据库
    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});