module.exports = {
    async getPriceCalendar(departure, arrival, cabin) {
      // 模拟未来30天价格数据
      const data = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        data.push({
          date: date.toISOString().split('T')[0],
          min_price: 600 + Math.floor(Math.random() * 200),
          currency: "CNY"
        });
      }
      return data;
    },
  
    async searchFlights(departure, arrival, date, cabin) {
      // 模拟航班数据
      return [
        {
          flight_no: "CA1501",
          departure_time: "08:30",
          arrival_time: "10:45",
          price: 720,
          airline: "中国国航",
          aircraft: "A330"
        },
        {
          flight_no: "MU5102",
          departure_time: "12:15",
          arrival_time: "14:30",
          price: 680,
          airline: "东方航空",
          aircraft: "B737"
        }
      ];
    }
  };