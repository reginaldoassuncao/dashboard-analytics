import { DataGenerator } from '../utils/dataGenerator.js';
import { DateUtils } from '../utils/dateUtils.js';

export class HistoricalData {
  constructor() {
    this.generator = new DataGenerator(123);
    this.baseData = this.generateBaseData();
  }

  generateBaseData() {
    const months = DateUtils.getLastNMonths(12);
    const metrics = this.generator.generateBusinessMetrics(2400000, 12);
    
    return {
      months,
      revenue: metrics.revenue,
      orders: metrics.orders,
      users: metrics.users,
      conversionRate: metrics.conversionRate,
      averageOrder: metrics.averageOrder,
      customerLifetimeValue: metrics.customerLifetimeValue
    };
  }

  getMonthlyData() {
    return this.baseData;
  }

  getDailyData(days = 90) {
    const dates = DateUtils.getLastNDays(days);
    const baseRevenue = this.baseData.revenue[this.baseData.revenue.length - 1] / 30;
    
    const dailyRevenue = dates.map(date => {
      const dayMultiplier = DateUtils.getDayOfWeekMultiplier(date);
      const randomFactor = this.generator.randomFloat(0.7, 1.4);
      return Math.round(baseRevenue * dayMultiplier * randomFactor);
    });

    const dailyOrders = dailyRevenue.map(rev => 
      Math.round(rev / this.generator.randomFloat(140, 170))
    );

    const dailyUsers = dailyOrders.map(orders => 
      Math.round(orders * this.generator.randomFloat(2.5, 4.0))
    );

    return {
      dates,
      revenue: dailyRevenue,
      orders: dailyOrders,
      users: dailyUsers,
      conversionRate: dailyOrders.map(() => 
        parseFloat(this.generator.randomFloat(2.5, 4.2).toFixed(2))
      )
    };
  }

  getYearOverYearComparison() {
    const currentYear = this.baseData;
    const previousYearMultiplier = 0.85;
    
    const previousYear = {
      months: currentYear.months,
      revenue: currentYear.revenue.map(val => 
        Math.round(val * previousYearMultiplier * this.generator.randomFloat(0.9, 1.1))
      ),
      orders: currentYear.orders.map(val => 
        Math.round(val * previousYearMultiplier * this.generator.randomFloat(0.9, 1.1))
      ),
      users: currentYear.users.map(val => 
        Math.round(val * previousYearMultiplier * this.generator.randomFloat(0.9, 1.1))
      )
    };

    return {
      current: currentYear,
      previous: previousYear,
      growth: {
        revenue: ((currentYear.revenue.reduce((a, b) => a + b, 0) - previousYear.revenue.reduce((a, b) => a + b, 0)) / previousYear.revenue.reduce((a, b) => a + b, 0) * 100).toFixed(1),
        orders: ((currentYear.orders.reduce((a, b) => a + b, 0) - previousYear.orders.reduce((a, b) => a + b, 0)) / previousYear.orders.reduce((a, b) => a + b, 0) * 100).toFixed(1),
        users: ((currentYear.users.reduce((a, b) => a + b, 0) - previousYear.users.reduce((a, b) => a + b, 0)) / previousYear.users.reduce((a, b) => a + b, 0) * 100).toFixed(1)
      }
    };
  }

  getQuarterlyData() {
    const quarters = DateUtils.getQuarters();
    const monthlyData = this.baseData;
    
    const quarterlyRevenue = [
      monthlyData.revenue.slice(0, 3).reduce((a, b) => a + b, 0),
      monthlyData.revenue.slice(3, 6).reduce((a, b) => a + b, 0),
      monthlyData.revenue.slice(6, 9).reduce((a, b) => a + b, 0),
      monthlyData.revenue.slice(9, 12).reduce((a, b) => a + b, 0)
    ];

    const quarterlyOrders = [
      monthlyData.orders.slice(0, 3).reduce((a, b) => a + b, 0),
      monthlyData.orders.slice(3, 6).reduce((a, b) => a + b, 0),
      monthlyData.orders.slice(6, 9).reduce((a, b) => a + b, 0),
      monthlyData.orders.slice(9, 12).reduce((a, b) => a + b, 0)
    ];

    return {
      quarters: quarters.map(q => q.label),
      revenue: quarterlyRevenue,
      orders: quarterlyOrders,
      averageOrder: quarterlyRevenue.map((rev, i) => 
        parseFloat((rev / quarterlyOrders[i]).toFixed(2))
      )
    };
  }

  getCohortData() {
    const cohorts = [];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
    
    months.forEach((month, cohortIndex) => {
      const retention = [];
      const baseUsers = this.generator.randomInt(800, 1200);
      
      for (let period = 0; period < 6; period++) {
        let retentionRate;
        if (period === 0) {
          retentionRate = 100;
        } else {
          const baseRetention = 65 - (period * 12);
          retentionRate = Math.max(10, baseRetention + this.generator.randomFloat(-8, 8));
        }
        retention.push(parseFloat(retentionRate.toFixed(1)));
      }
      
      cohorts.push({
        cohort: month,
        users: baseUsers,
        retention
      });
    });

    return cohorts;
  }

  getGeographicData() {
    const cities = [
      { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
      { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
      { name: 'Belo Horizonte', lat: -19.9167, lng: -43.9345 },
      { name: 'Salvador', lat: -12.9714, lng: -38.5014 },
      { name: 'Brasília', lat: -15.8267, lng: -47.9218 },
      { name: 'Fortaleza', lat: -3.7172, lng: -38.5434 },
      { name: 'Recife', lat: -8.0476, lng: -34.8770 },
      { name: 'Porto Alegre', lat: -30.0346, lng: -51.2177 }
    ];

    return cities.map(city => ({
      ...city,
      users: this.generator.randomInt(2000, 15000),
      revenue: this.generator.randomFloat(180000, 800000),
      orders: this.generator.randomInt(1200, 6000)
    }));
  }

  getFunnelData() {
    const totalVisitors = 125000;
    const stages = [
      { name: 'Visitantes', count: totalVisitors, rate: 100 },
      { name: 'Visualizações de Produto', count: Math.round(totalVisitors * 0.45), rate: 45 },
      { name: 'Adicionar ao Carrinho', count: Math.round(totalVisitors * 0.12), rate: 12 },
      { name: 'Iniciar Checkout', count: Math.round(totalVisitors * 0.08), rate: 8 },
      { name: 'Finalizar Compra', count: Math.round(totalVisitors * 0.035), rate: 3.5 }
    ];

    return stages;
  }

  getHeatmapData() {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    
    const data = [];
    
    days.forEach((day, dayIndex) => {
      hours.forEach(hour => {
        let activity;
        
        if (dayIndex === 0 || dayIndex === 6) {
          activity = this.generator.randomInt(20, 60);
        } else {
          if (hour >= 9 && hour <= 17) {
            activity = this.generator.randomInt(70, 100);
          } else if (hour >= 19 && hour <= 22) {
            activity = this.generator.randomInt(60, 85);
          } else {
            activity = this.generator.randomInt(15, 45);
          }
        }
        
        data.push({
          day: dayIndex,
          hour,
          value: activity
        });
      });
    });

    return {
      days,
      hours,
      data
    };
  }
}

export const historicalData = new HistoricalData();