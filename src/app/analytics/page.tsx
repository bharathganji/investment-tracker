"use client";

import { useState, useEffect } from "react";
import { getTrades } from "@/lib/data-store";
import {
  calculatePerformanceMetrics,
  calculateFeesPaid,
} from "@/lib/calculations";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TradeHistoryTable } from "@/app/_components/trade-history-table";
import { PerformanceOverviewChart } from "@/app/_components/charts/performance-overview-chart";
import { FeeAnalysisChart } from "@/app/_components/charts/fee-analysis-chart";

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    totalProfitLoss: 0,
    totalFeesPaid: 0,
    roi: 0,
    cagr: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    try {
      const trades = getTrades();
      const performance = calculatePerformanceMetrics(trades);

      setMetrics({
        totalTrades: performance.totalTrades,
        totalProfitLoss: performance.totalProfitLoss,
        totalFeesPaid: performance.totalFeesPaid,
        roi: performance.roi,
        cagr: performance.cagr,
      });
    } catch (error) {
      console.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl p-6">
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>Loading analytics...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">Loading analytics...</div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Reports</CardTitle>
          <CardDescription>
            Performance metrics and detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalTrades}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total P&L
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${metrics.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  ${metrics.totalProfitLoss.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Fees Paid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  ${metrics.totalFeesPaid.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${metrics.roi >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {metrics.roi.toFixed(2)}%
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  CAGR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${metrics.cagr >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {metrics.cagr.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Key performance indicators and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PerformanceOverviewChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Analysis</CardTitle>
            <CardDescription>
              Trading fees breakdown and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FeeAnalysisChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>Your most recent trading activity</CardDescription>
        </CardHeader>
        <CardContent>
          <TradeHistoryTable limit={10} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Reports</CardTitle>
          <CardDescription>
            Export and analyze your trading data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Monthly Performance Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Asset Allocation Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Trade History Export (CSV)
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
