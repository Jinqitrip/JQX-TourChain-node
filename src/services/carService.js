module.exports = {
    async getCarList(city, serviceType, date) {
      // 模拟数据，实际应替换为数据库查询
      return [
        {
          id: "CAR_001",
          type: "7座商务车",
          price_per_day: 800,
          driver_info: "王师傅 | 5年驾龄",
          tags: ["免费WIFI", "双语服务"]
        },
        {
          id: "CAR_002",
          type: "5座轿车",
          price_per_day: 500,
          driver_info: "李师傅 | 3年驾龄",
          tags: ["儿童座椅", "接机服务"]
        }
      ]
      // 根据参数过滤逻辑（示例）
      .filter(car => 
        (!serviceType || car.type.includes(serviceType)) &&
        (!date || car.available_dates?.includes(date)) // 假设有可用日期字段
      );
    }
  };