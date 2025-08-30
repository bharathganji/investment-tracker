"use client";

import { useState, useEffect } from 'react';
import { getTrades } from '@/lib/data-store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { motion } from 'framer-motion';

interface PortfolioChartDataPoint {
  date: string;
  value: number;
}

export function PortfolioChart() {
  const [chartData, setChartData] = useState<PortfolioChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    try {
      const trades = getTrades();
      
      // Group trades by date and calculate cumulative portfolio value
      const groupedData: Record<string, number> = {};
      
      trades.forEach(trade => {
        const dateKey = trade.date.toISOString().split('T')[0];
        if (dateKey) {
          const tradeValue = trade.quantity * trade.price;
          const netValue = trade.side === 'buy' ? -tradeValue : tradeValue;
          
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = 0;
          }
          groupedData[dateKey] += netValue - trade.fees;
        }
      });

      // Convert to cumulative values and chart data format
      let cumulativeValue = 0;
      const data: PortfolioChartDataPoint[] = Object.entries(groupedData)
        .map(([date, dailyChange]) => {
          cumulativeValue += dailyChange;
          return {
            date,
            value: parseFloat(cumulativeValue.toFixed(2))
          };
        })
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Portfolio Performance</EnhancedCardTitle>
          <EnhancedCardDescription>Loading portfolio performance data...</EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  if (chartData.length === 0) {
    return (
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Portfolio Performance</EnhancedCardTitle>
          <EnhancedCardDescription>No data available for portfolio performance</EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No trades recorded yet</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Portfolio Performance</EnhancedCardTitle>
          <EnhancedCardDescription>Historical portfolio value changes over time</EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Portfolio Value']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  name="Portfolio Value" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </motion.div>
  );
}
