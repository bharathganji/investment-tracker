"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from '@/store/hooks';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FeeDataPoint {
  month: string;
  totalFees: number;
}

export function FeeAnalysisChart() {
  const tradesState = useAppSelector((state) => state.trades);
  const trades = tradesState && 'trades' in tradesState ? tradesState.trades : [];
  const tradesLoading = tradesState && 'loading' in tradesState ? tradesState.loading : false;
  
  const [chartData, setChartData] = useState<FeeDataPoint[]>([]);
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
      // Group trades by month and calculate total fees
      const monthlyData: Record<
        string,
        { totalFees: number }
      > = {};

      trades.forEach((trade) => {
        const tradeDate = new Date(trade.date);
        const monthKey = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { totalFees: 0 };
        }

        monthlyData[monthKey].totalFees += trade.fees;
      });

      // Convert to chart data format
      const data: FeeDataPoint[] = Object.entries(monthlyData)
        .map(([month, fees]) => ({
          month,
          totalFees: parseFloat(fees.totalFees.toFixed(2)),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating fee chart data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">No fee data available</p>
      </div>
    );
  }

  return (
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
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Fees"]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Bar
            dataKey="totalFees"
            fill="#8884d8"
            name="Total Fees"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
