"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { type CalculatedPortfolioHolding } from "@/types/portfolio";

interface PortfolioAllocationChartProps {
  standalone?: boolean;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#884d8",
  "#82ca9d",
];

export function PortfolioAllocationChart({
  standalone = true,
}: PortfolioAllocationChartProps) {
  const portfolioState = useAppSelector((state) => state.portfolio);
  const holdings =
    portfolioState && "holdings" in portfolioState
      ? portfolioState.holdings
      : [];
  const portfolioLoading =
    portfolioState && "loading" in portfolioState
      ? portfolioState.loading
      : false;

  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const calculateChartData = useCallback(() => {
    try {
      // Convert holdings to chart data format
      const data = holdings
        .map((holding: CalculatedPortfolioHolding) => ({
          name: holding.asset,
          value: holding.currentValue,
        }))
        .filter((item) => item.value > 0); // Only include assets with positive value

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating allocation chart data:", error);
      setLoading(false);
    }
  }, [holdings]);

  useEffect(() => {
    // Update loading state when portfolio data changes
    setLoading(portfolioLoading);

    // Calculate chart data when holdings are loaded
    if (!portfolioLoading) {
      calculateChartData();
    }
  }, [holdings, portfolioLoading, calculateChartData]);

  if (loading) {
    if (standalone) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading allocation data...</p>
        </div>
      );
    } else {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading allocation data...</p>
        </div>
      );
    }
  }

  if (chartData.length === 0) {
    if (standalone) {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No allocation data available</p>
        </div>
      );
    } else {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No allocation data available</p>
        </div>
      );
    }
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
              "Value",
            ]}
            labelFormatter={(label) => `Asset: ${label}`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
