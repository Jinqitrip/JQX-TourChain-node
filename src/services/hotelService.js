module.exports = {
    async getHotelsByCriteria(brand, region, sort) {
      // 实际应替换为数据库操作
      let hotels = [
        { id: 'H001', name: '北京凯悦酒店', brand: '凯悦', region: '朝阳区', rating: 4.8 },
        { id: 'H002', name: '王府井希尔顿', brand: '希尔顿', region: '东城区', rating: 4.7 },
        { id: 'H003', name: '华贸万豪酒店', brand: '万豪', region: '朝阳区', rating: 4.9 }
      ];
  
      // 过滤逻辑
      if (brand) hotels = hotels.filter(h => h.brand === brand);
      if (region) hotels = hotels.filter(h => h.region === region);
      
      // 排序逻辑
      if (sort === 'rating_desc') {
        hotels.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'rating_asc') {
        hotels.sort((a, b) => a.rating - b.rating);
      }
  
      return hotels;
    },
  
    async searchHotels(keyword, city, sort) {
      // 实际应替换为数据库操作
      let hotels = [
        { id: 'H001', name: '北京凯悦酒店', region: '朝阳区', tags: ['五星级', '商务'] },
        { id: 'H004', name: '国贸大酒店', region: '朝阳区', tags: ['地标'] },
        { id: 'H005', name: '三里屯洲际酒店', region: '朝阳区', tags: ['设计感'] }
      ];
  
      // 关键词过滤
      const lowerKeyword = keyword.toLowerCase();
      hotels = hotels.filter(h => 
        h.name.toLowerCase().includes(lowerKeyword) ||
        h.tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
      );
  
      // 城市过滤
      if (city) {
        const lowerCity = city.toLowerCase();
        hotels = hotels.filter(h => h.region.toLowerCase().includes(lowerCity));
      }
  
      // 排序（复用相同逻辑）
      return this.getHotelsByCriteria(null, null, sort);
    }
  };