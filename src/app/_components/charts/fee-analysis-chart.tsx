"use client";

import { useState, useEffect } from "react";
import { getTrades } from "@/lib/data-store";
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
  makerFees: number;
  takerFees: number;
  totalFees: number;
}

export function FeeAnalysisChart() {
  const [chartData, setChartData] = useState<FeeDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = () => {
    try {
      const trades = getTrades();

      // Group trades by month and calculate fees by type
      const monthlyData: Record<
        string,
        { makerFees: number; takerFees: number; totalFees: number }
      > = {};

      trades.forEach((trade) => {
        const monthKey = `${trade.date.getFullYear()}-${String(trade.date.getMonth() + 1).padStart(2, "0")}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { makerFees: 0, takerFees: 0, totalFees: 0 };
        }

        if (trade.tradeType === "maker") {
          monthlyData[monthKey].makerFees += trade.fees;
        } else {
          monthlyData[monthKey].takerFees += trade.fees;
        }

        monthlyData[monthKey].totalFees += trade.fees;
      });

      // Convert to chart data format
      const data: FeeDataPoint[] = Object.entries(monthlyData)
        .map(([month, fees]) => ({
          month,
          makerFees: parseFloat(fees.makerFees.toFixed(2)),
          takerFees: parseFloat(fees.takerFees.toFixed(2)),
          totalFees: parseFloat(fees.totalFees.toFixed(2)),
        }))
        .sort((a, b) => a.month.localeCompare(b.month));

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading fee chart data:", error);
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
            dataKey="makerFees"
            stackId="a"
            fill="#8884d8"
            name="Maker Fees"
          />
          <Bar
            dataKey="takerFees"
            stackId="a"
            fill="#82ca9d"
            name="Taker Fees"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
