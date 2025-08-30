"use client";

import { useState, useEffect } from "react";
import { getTrades } from "@/lib/data-store";
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
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    try {
      const trades = getTrades();

      // Group trades by month and calculate cumulative P&L
      const monthlyData: Record<
        string,
        { totalPnL: number; tradeCount: number }
      > = {};

      trades.forEach((trade) => {
        const monthKey = `${trade.date.getFullYear()}-${String(trade.date.getMonth() + 1).padStart(2, "0")}`;

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
      console.error("Error loading chart data:", error);
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
            fill="#8884d8"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
