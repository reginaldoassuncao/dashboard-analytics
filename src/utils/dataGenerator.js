export class DataGenerator {
  constructor(seed = 12345) {
    this.seed = seed;
    this.rng = this.mulberry32(seed);
  }

  mulberry32(a) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  random() {
    return this.rng();
  }

  randomInt(min, max) {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  randomFloat(min, max) {
    return this.random() * (max - min) + min;
  }

  randomChoice(array) {
    return array[Math.floor(this.random() * array.length)];
  }

  normalDistribution(mean, stdDev) {
    const u = 1 - this.random();
    const v = this.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
  }

  generateTrend(baseValue, trendRate, variance, dataPoints) {
    const data = [];
    let currentValue = baseValue;
    
    for (let i = 0; i < dataPoints; i++) {
      const trend = currentValue * (1 + trendRate / 100);
      const noise = this.normalDistribution(0, variance);
      currentValue = Math.max(0, trend + noise);
      data.push(Math.round(currentValue));
    }
    
    return data;
  }

  generateSeasonality(baseValues, seasonalityFactor = 0.2, peakMonths = [11, 0]) {
    return baseValues.map((value, index) => {
      const month = index % 12;
      let seasonalMultiplier = 1;
      
      if (peakMonths.includes(month)) {
        seasonalMultiplier = 1 + seasonalityFactor;
      } else if ([5, 6, 7].includes(month)) {
        seasonalMultiplier = 1 - seasonalityFactor * 0.5;
      }
      
      return Math.round(value * seasonalMultiplier);
    });
  }

  generateBusinessMetrics(baseRevenue, months = 12) {
    const revenue = this.generateTrend(baseRevenue, 2.5, baseRevenue * 0.1, months);
    const seasonalRevenue = this.generateSeasonality(revenue, 0.25, [10, 11]);
    
    const orders = seasonalRevenue.map(rev => Math.round(rev / this.randomFloat(140, 170)));
    const users = orders.map((ord, i) => Math.round(ord * this.randomFloat(2.8, 3.5) + i * 150));
    const conversionRate = orders.map((ord, i) => {
      const base = 3.2 + (this.random() - 0.5) * 0.8;
      return Math.max(1.5, Math.min(5.0, base));
    });
    
    return {
      revenue: seasonalRevenue,
      orders,
      users,
      conversionRate: conversionRate.map(rate => parseFloat(rate.toFixed(2))),
      averageOrder: seasonalRevenue.map((rev, i) => parseFloat((rev / orders[i]).toFixed(2))),
      customerLifetimeValue: users.map((user, i) => parseFloat(((seasonalRevenue[i] / user) * 6).toFixed(2)))
    };
  }

  generateCategoryData() {
    const categories = [
      { name: 'Electronics', baseShare: 35 },
      { name: 'Fashion', baseShare: 28 },
      { name: 'Home & Garden', baseShare: 18 },
      { name: 'Sports', baseShare: 12 },
      { name: 'Books', baseShare: 7 }
    ];
    
    return categories.map(cat => ({
      ...cat,
      share: cat.baseShare + this.randomFloat(-3, 3),
      growth: this.randomFloat(-15, 25)
    }));
  }

  generateTrafficChannels() {
    const channels = [
      { name: 'Organic Search', baseShare: 45 },
      { name: 'Paid Search', baseShare: 25 },
      { name: 'Social Media', baseShare: 15 },
      { name: 'Email', baseShare: 8 },
      { name: 'Direct', baseShare: 7 }
    ];
    
    return channels.map(channel => ({
      ...channel,
      share: channel.baseShare + this.randomFloat(-5, 5),
      cpc: this.randomFloat(0.5, 3.5),
      conversionRate: this.randomFloat(2.1, 4.8)
    }));
  }

  generateProductData(count = 50) {
    const categories = ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'];
    const statuses = ['active', 'inactive', 'out-of-stock'];
    const products = [];
    
    for (let i = 1; i <= count; i++) {
      const category = this.randomChoice(categories);
      const basePrice = this.randomFloat(29.99, 999.99);
      const sales = this.randomInt(10, 500);
      
      products.push({
        id: i,
        name: `${category} Product ${i}`,
        category,
        price: parseFloat(basePrice.toFixed(2)),
        sales,
        revenue: parseFloat((basePrice * sales).toFixed(2)),
        status: this.randomChoice(statuses),
        rating: parseFloat(this.randomFloat(3.5, 5.0).toFixed(1)),
        stock: this.randomInt(0, 200)
      });
    }
    
    return products.sort((a, b) => b.revenue - a.revenue);
  }

  generateUserData(count = 1000) {
    const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Brasília', 'Fortaleza'];
    const sources = ['Google', 'Facebook', 'Instagram', 'Email', 'Direct'];
    const users = [];
    
    for (let i = 1; i <= count; i++) {
      const registrationDate = new Date(2024, this.randomInt(0, 11), this.randomInt(1, 28));
      const lastActivity = new Date(2024, 11, this.randomInt(1, 25));
      
      users.push({
        id: i,
        name: `User ${i}`,
        email: `user${i}@email.com`,
        city: this.randomChoice(cities),
        registrationDate: registrationDate.toISOString().split('T')[0],
        lastActivity: lastActivity.toISOString().split('T')[0],
        totalSpent: parseFloat(this.randomFloat(50, 2500).toFixed(2)),
        orderCount: this.randomInt(1, 25),
        source: this.randomChoice(sources),
        isActive: this.random() > 0.2
      });
    }
    
    return users.sort((a, b) => b.totalSpent - a.totalSpent);
  }
}