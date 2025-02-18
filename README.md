# JQX-TourChain-node
锦麒行云游链节点社区版

## 项目结构

```
src
└── com.jinqitrip.jtcn
    ├── common               // 通用组件
    │   ├── config           // 配置类（Security/JPA/Redis等）
    │   ├── exception        // 自定义异常处理
    │   ├── utils            // 工具类集合
    │   └── response         // 统一响应格式
    ├── modules              // 功能模块
    │   ├── guide            // 导游管理模块
    │   │   ├── controller   // API接口层
    │   │   ├── service      // 业务逻辑层 
    │   │   ├── repository   // 数据访问层
    │   │   └── model        // 实体和DTO
    │   ├── schedule         // 时间管理模块
    │   ├── order            // 订单管理模块
    │   ├── review           // 评价管理模块
    │   ├── finance          // 财务管理模块
    │   └── auth            // 认证授权模块
    └── CampusGuideApplication.java // 启动类
```
