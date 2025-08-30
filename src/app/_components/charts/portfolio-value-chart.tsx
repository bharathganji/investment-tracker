"use client";

import { useState, useEffect } from 'react';
import { getTrades } from '@/lib/data-store';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioValueDataPoint {
  date: string;
  value: number;
  cumulativePnL: number;
}

export function PortfolioValueChart() {
  const [chartData, setChartData] = useState<PortfolioValueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    try {
      const trades = getTrades();
      
      // Group trades by date and calculate cumulative portfolio value
      const groupedData: Record<string, { totalValue: number; totalPnL: number }> = {};
      
      trades.forEach(trade => {
        const dateKey = trade.date.toISOString().split('T')[0];
        
        if (dateKey) {
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = { totalValue: 0, totalPnL: 0 };
          }
          
          const tradeValue = trade.quantity * trade.price;
          const tradePnL = trade.side === 'buy' ? -tradeValue : tradeValue;
          
          groupedData[dateKey].totalValue += trade.side === 'buy' ? tradeValue : -tradeValue;
          groupedData[dateKey].totalPnL += tradePnL - trade.fees;
        }
      });
      
      // Convert to chart data format
      const data: PortfolioValueDataPoint[] = Object.entries(groupedData)
        .map(([date, values]) => ({
          date,
          value: parseFloat(values.totalValue.toFixed(2)),
          cumulativePnL: parseFloat(values.totalPnL.toFixed(2))
        }))
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
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>Loading portfolio performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
          <CardDescription>No data available for portfolio performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">No trades recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Value</CardTitle>
        <CardDescription>Historical portfolio value and performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']}
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
              <Area 
                type="monotone" 
                dataKey="cumulativePnL" 
                name="Cumulative P&L" 
                stroke="#82ca9d" 
                fill="#82ca9d" 
                fillOpacity={0.3} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
