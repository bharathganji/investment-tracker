"use client";

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { motion } from 'framer-motion';

interface PortfolioChartDataPoint {
  date: string;
  value: number;
}

interface PortfolioChartProps {
  standalone?: boolean;
}

export function PortfolioChart({ standalone = true }: PortfolioChartProps) {
  const tradesState = useAppSelector((state) => state.trades);
  const trades = tradesState && 'trades' in tradesState ? tradesState.trades : [];
  const tradesLoading = tradesState && 'loading' in tradesState ? tradesState.loading : false;
  
  const [chartData, setChartData] = useState<PortfolioChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update loading state when trades data changes
    setLoading(tradesLoading);
    
    // Calculate chart data when trades are loaded
    if (!tradesLoading && trades.length > 0) {
      calculateChartData();
    }
  }, [trades, tradesLoading]);

  const calculateChartData = () => {
    try {
      // Group trades by date and calculate cumulative portfolio value
      // This represents the value of assets bought/sold over time
      const groupedData: Record<string, number> = {};
      
      trades.forEach(trade => {
        const dateKey = trade.date instanceof Date
          ? trade.date.toISOString().split('T')[0]
          : typeof trade.date === "string"
          ? new Date(trade.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        if (dateKey) {
          const tradeValue = trade.quantity * trade.price;
          // For portfolio value tracking, we count the value of assets held
          // Buy adds to portfolio value, sell reduces portfolio value
          const netValue = trade.side === 'buy' ? tradeValue : -tradeValue;
          
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
      console.error('Error calculating chart data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    if (standalone) {
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
    } else {
      return (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart...</p>
        </div>
      );
    }
  }

  if (chartData.length === 0) {
    if (standalone) {
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
    } else {
      return (
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No trades recorded yet</p>
        </div>
      );
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {standalone ? (
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
                  <YAxis
                    tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                    domain={['auto', 'auto']}
                  />
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
                    fill="#884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      ) : (
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
              <YAxis
                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
              />
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
                fill="#884d8"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
