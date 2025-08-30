"use client";

import { useState, useEffect } from 'react';
import { getTrades } from '@/lib/data-store';
import { calculatePerformanceMetrics } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceDataPoint {
  metric: string;
  value: number;
}

export function PerformanceChart() {
  const [chartData, setChartData] = useState<PerformanceDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    try {
      const trades = getTrades();
      const performance = calculatePerformanceMetrics(trades);
      
      const data: PerformanceDataPoint[] = [
        { metric: 'Total Trades', value: performance.totalTrades },
        { metric: 'Total P&L', value: performance.totalProfitLoss },
        { metric: 'Total Fees', value: performance.totalFeesPaid },
        { metric: 'ROI', value: performance.roi },
        { metric: 'CAGR', value: performance.cagr }
      ];
      
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
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
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
          <CardTitle>Performance Metrics</CardTitle>
          <CardDescription>No data available for performance analysis</CardDescription>
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
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators and analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']}
                labelFormatter={(label) => `Metric: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="value" 
                name="Performance Value" 
                fill="#8884d8" 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
