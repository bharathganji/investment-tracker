"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadTrades } from "@/store/trades/tradesThunks";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type SerializableTrade } from "@/types";

interface PortfolioValueDataPoint {
  date: string;
  value: number;
  cumulativePnL: number;
}

interface PortfolioValueChartProps {
  standalone?: boolean;
}

export function PortfolioValueChart({
  standalone = true,
}: PortfolioValueChartProps) {
  const dispatch = useAppDispatch();
  const tradesState = useAppSelector((state) => state.trades);
  const trades: SerializableTrade[] =
    tradesState && "trades" in tradesState ? tradesState.trades : [];
  const tradesLoading =
    tradesState && "loading" in tradesState ? tradesState.loading : false;

  const [chartData, setChartData] = useState<PortfolioValueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load trades data
    const loadTradesData = async () => {
      try {
        setLoading(true);
        await dispatch(loadTrades()).unwrap();
      } catch (error) {
        console.error("Error loading trades:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadTradesData();
  }, [dispatch]);

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
      const groupedData: Record<
        string,
        { totalValue: number; totalPnL: number }
      > = {};

      trades.forEach((trade) => {
        // Ensure we're working with a string date
        let dateString: string;
        if (typeof trade.date === "string") {
          dateString = trade.date;
        } else {
          dateString = new Date().toISOString();
        }

        const dateKey = dateString.split("T")[0];

        if (dateKey) {
          if (!groupedData[dateKey]) {
            groupedData[dateKey] = { totalValue: 0, totalPnL: 0 };
          }

          const tradeValue = trade.quantity * trade.price;
          const tradePnL = trade.side === "buy" ? -tradeValue : tradeValue;

          groupedData[dateKey].totalValue +=
            trade.side === "buy" ? tradeValue : -tradeValue;
          groupedData[dateKey].totalPnL += tradePnL - trade.fees;
        }
      });

      // Convert to chart data format
      const data: PortfolioValueDataPoint[] = Object.entries(groupedData)
        .map(([date, values]) => ({
          date,
          value: parseFloat(values.totalValue.toFixed(2)),
          cumulativePnL: parseFloat(values.totalPnL.toFixed(2)),
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      setChartData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error calculating chart data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load trades data
    const loadTradesData = async () => {
      try {
        setLoading(true);
        await dispatch(loadTrades()).unwrap();
      } catch (error) {
        console.error("Error loading trades:", error);
      } finally {
        setLoading(false);
      }
    };

    void loadTradesData();
  }, [dispatch]);

  useEffect(() => {
    // Update loading state when trades data changes
    setLoading(tradesLoading);

    // Calculate chart data when trades are loaded
    if (!tradesLoading && trades.length > 0) {
      calculateChartData();
    }
  }, [trades, tradesLoading, calculateChartData]);

  if (loading) {
    if (standalone) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>
              Loading portfolio performance data...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">Loading chart...</p>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">Loading chart...</p>
        </div>
      );
    }
  }

  if (chartData.length === 0) {
    if (standalone) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>
              No data available for portfolio performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center">
              <p className="text-muted-foreground">No trades recorded yet</p>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <div className="flex h-64 items-center justify-center">
          <p className="text-muted-foreground">No trades recorded yet</p>
        </div>
      );
    }
  }

  return (
    <>
      {standalone ? (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
            <CardDescription>
              Historical portfolio value and performance
            </CardDescription>
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
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Value",
                    ]}
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
      ) : (
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
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Value"]}
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
      )}
    </>
  );
}
