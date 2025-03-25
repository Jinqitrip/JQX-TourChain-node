# 订单服务 API 文档

## 概述

本服务提供旅游订单管理系统核心功能，包含订单创建、状态管理、用户订单查询等功能

## 基础信息

- **Base URL**: `http://localhost:1919`
- **数据格式**: JSON
- **认证方式**: 通过`openID`标识用户身份

## 订单状态说明

| 状态值      | 描述     |
|-------------|----------|
| pending      | 订单创建成功 |
| selecting      | 等selecting导游 |
| upcoming      | 导游已确认 |
| reviewing      | 服务completed |
| completed      | 订单完结 |

## 接口列表

### 创建订单

**Endpoint**  
`POST /v1/orders`

**中间件检查**  

- 用户必须没有进行中的订单（状态 ≠ completed）

**请求体示例**:

```json
{
  "openID": "user123",
  "data": {
    "date": "2023-08-15",
    "time": "14:00",
    "people": 4,
    "special_tags": ["老人", "儿童"],
    "note": "需要英语导游"
  }
}
```

**成功响应**:

```json
{
  "message": "Order created successfully",
  "orderId": "64d1f8a5e5f6c834b8e7b123"
}
```

**错误码**:

- 400: 缺少必要字段 / 已有进行中订单
- 500: 服务器内部错误

### 获取订单

**Endpoint**  
`GET /v1/orders/{orderId}`

**路径参数**:

- `orderId` - 订单ID（MongoDB ObjectId）

**成功响应**:

```json
{
  ......
}
```

**错误码**:

- 404: 订单不存在
- 500: 服务器内部错误

### 获取订单状态

**Endpoint**  
`GET /v1/orders/{orderId}/status`

**路径参数**:

- `orderId` - 订单ID（MongoDB ObjectId）

**成功响应**:

```json
{
  "status": "pending"
}
```

**错误码**:

- 404: 订单不存在
- 500: 服务器内部错误

### 更新订单状态

**Endpoint**  
`PATCH /v1/orders/{orderId}/status`

**请求参数**:

```json
{
  "status": "upcoming",
  "guideID": "guide456",  // 状态变更为upcoming时必填
  "location": "上海外滩",
  "price": 800
}
```

**状态转换规则**:

- 从`selecting` → `upcoming` 必须指定导游ID
- 可同步更新价格和位置信息

**成功响应**:

```json
{
  "message": "订单状态更新成功"
}
```

### 获取用户订单历史

**Endpoint**  
`GET /v1/orders/user/{openID}`

**查询参数**:

- `openID` - 用户唯一标识

**响应示例**:

```json
[
  {
    "_id": "64d1f8a5e5f6c834b8e7b123",
    "status": "completed",
    "createdAt": "2023-08-10T02:15:25.000Z",
    "data": {
      "people": 2,
      "date": "2023-08-15"
    }
  }
]
```

### 获取当前活跃订单

**Endpoint**  
`GET /v1/orders/user/{openID}/active`

**特性**:

- 自动返回最新的未完成订单
- 包含完整订单详情

**响应示例**:

```json
{
  "status": "reviewing",
  "guideID": "guide789",
  "data": {
    "note": "需要轮椅通道",
    "time": "09:30"
  }
}
```

## 错误处理

| 状态码 | 错误类型                  | 说明                     |
|--------|--------------------------|--------------------------|
| 400    | Bad Request             | 请求参数格式错误         |
| 404    | Not Found               | 资源不存在               |
| 500    | Internal Server Error   | 服务器内部错误           |

**典型错误响应**:

```json
{
  "error": "已有进行中的订单，请先完成当前订单"
}
```

## 数据模型

### 订单对象结构

```typescript
interface Order {
  openID: string;      // 用户唯一标识
  guideID?: string;    // 导游ID（可选）
  price?: number;      // 订单价格
  location?: string;   // 服务地点
  data: {
    date: string;      // 服务日期（YYYY-MM-DD）
    time: string;      // 服务时间（HH:mm）
    people: number;    // 人数
    special_tags?: string[]; // 特殊需求标签
    note?: string;     // 备注信息
  };
  status: string;      // 订单状态
  createdAt: Date;     // 创建时间
}
```
