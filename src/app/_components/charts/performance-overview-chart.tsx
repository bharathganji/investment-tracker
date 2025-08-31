"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from '@/store/hooks';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
 month: string;
  pnl: number;
  cumulativePnL: number;
  trades: number;
}

export function PerformanceOverviewChart() {
  const tradesState = useAppSelector((state) => state.trades);
  const trades = tradesState && 'trades' in tradesState ? tradesState.trades : [];
  const tradesLoading = tradesState && 'loading' in tradesState ? tradesState.loading : false;
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update loading state when tradesLoading changes
    setLoading(tradesLoading);
  }, [tradesLoading]);
  
  useEffect(() => {
    // Calculate chart data when trades are loaded and trades change
    if (!tradesLoading && trades.length > 0) {
      calculateChartData();
    } else if (tradesLoading) {
      // Clear chart data when loading starts
      setChartData([]);
    }
  }, [trades, tradesLoading]);

  const calculateChartData = () => {
    try {
      // Group trades by month and calculate cumulative P&L
      const monthlyData: Record<
        string,
        { totalPnL: number; tradeCount: number }
      > = {};

      trades.forEach((trade) => {
        const tradeDate = new Date(trade.date);
        const monthKey = `${tradeDate.getFullYear()}-${String(tradeDate.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { totalPnL: 0, tradeCount: 0 };
        }

        // Calculate P&L for this trade (simplified)
        const tradeValue = trade.quantity * trade.price;
        const tradePnL = trade.side === "buy" ? -tradeValue : tradeValue;

        monthlyData[monthKey].totalPnL += tradePnL;
        monthlyData[monthKey].tradeCount += 1;
      });

      // Convert to cumulative data
      let cumulativePnL = 0;
      const data = Object.entries(monthlyData)
        .map(([month, stats]) => {
          cumulativePnL += stats.totalPnL;
          return {
            month,
            pnl: stats.totalPnL,
            cumulativePnL,
            trades: stats.tradeCount,
          };
        })
        .sort((a, b) => a.month.localeCompare(b.month));

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating chart data:", error);
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
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
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
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toFixed(2)}`,
              "Cumulative P&L",
            ]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Area
            type="monotone"
            dataKey="cumulativePnL"
            stroke="#8884d8"
            fill="#884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
