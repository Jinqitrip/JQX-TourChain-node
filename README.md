# JQX-TourChain-node
锦麒行云游链节点社区版

## 项目结构

```
src/
├── app.js  入口文件
├── config/
│   └── redis.js  Redis配置文件
├── controllers/
│   ├── authController.js  认证授权相关控制器
│   ├── configController.js  系统配置相关控制器
│   ├── notificationController.js  消息通知相关控制器
│   ├── orderController.js  订单管理相关控制器
├── middleware/
│   └── authMiddleware.js  认证授权相关中间件
├── routes/
│   ├── authRoutes.js  认证授权相关路由
│   ├── configRoutes.js  系统配置相关路由
│   ├── notificationRoutes.js  消息通知相关路由
│   ├── orderRoutes.js  订单管理相关路由
│   └── supportRoutes.js  客服支持相关路由
├── services/
│   ├── configService.js  系统配置相关服务
│   ├── notificationService.js  消息通知相关服务
│   ├── orderService.js  订单管理相关服务
│   ├── smsService.js  短信服务相关功能
│   ├── supportService.js  客服支持相关服务
│   └── userService.js  用户管理相关服务
└── utils/
    └── auth.js  认证授权工具函数
```

总而言之，访问通过app.js转发至对应的路由，路由通用对应的控制器，控制器调用服务层。中间件在路由中处理请求，控制器处理业务逻辑，服务层调用数据库，工具类封装常用功能。
