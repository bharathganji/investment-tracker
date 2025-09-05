"use client";

import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { fromSerializableTrade } from "@/lib/utils";
import { calculateEnhancedPerformanceMetrics } from "@/lib/calculations/enhanced-metrics";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { MetricsGrid } from "./_components/metrics-grid";
import { PerformanceOverview } from "./_components/performance-overview";
import { FeeAnalysis } from "./_components/fee-analysis";
import { RecentTrades } from "./_components/recent-trades";
import { DetailedReports } from "./_components/detailed-reports";
import { GoalInsightsSummary } from "./_components/goal-insights-summary";
import { ProtectedRoute } from "@/components/protected-route";

export default function AnalyticsPage() {
  const tradesState = useAppSelector((state) => state.trades);
  const trades =
    tradesState && "trades" in tradesState ? tradesState.trades : [];
  const tradesLoading =
    tradesState && "loading" in tradesState ? tradesState.loading : false;

  const [metrics, setMetrics] = useState({
    totalTrades: 0,
    totalProfitLoss: 0,
    totalFeesPaid: 0,
    roi: 0,
    cagr: 0,
    winLossRatio: 0,
    averageWin: 0,
    averageLoss: 0,
    profitFactor: 0,
    winRate: 0,
    maxDrawdown: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateAnalyticsData = useCallback(() => {
    // Only process when there are trades
    if (trades.length === 0) {
      setLoading(false);
      return;
    }
    try {
      // Convert serializable trades to Trade objects with Date instances
      const tradesWithDates = trades.map(fromSerializableTrade);
      const performance = calculateEnhancedPerformanceMetrics(tradesWithDates);

      setMetrics({
        totalTrades: performance.totalTrades,
        totalProfitLoss: performance.totalProfitLoss,
        totalFeesPaid: performance.totalFeesPaid,
        roi: performance.roi,
        cagr: performance.cagr,
        winLossRatio: performance.winLossRatio,
        averageWin: performance.averageWin,
        averageLoss: performance.averageLoss,
        profitFactor: performance.profitFactor,
        winRate: performance.winRate,
        maxDrawdown: performance.maxDrawdown,
      });
    } catch (error) {
      console.error("Error calculating analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, [trades]);

  useEffect(() => {
    // Update loading state when trades data changes
    setLoading(tradesLoading);

    // Calculate analytics data when trades are loaded
    if (!tradesLoading && trades.length > 0) {
      calculateAnalyticsData();
    }
  }, [tradesLoading, calculateAnalyticsData, trades.length]);

  if (loading) {
    return (
      <ProtectedRoute>
        <section className="mx-auto max-w-6xl p-6">
          <EnhancedCard className="rounded-xl" animateOnHover>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Analytics & Reports</EnhancedCardTitle>
              <EnhancedCardDescription>
                Loading analytics...
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="py-8 text-center">Loading analytics...</div>
            </EnhancedCardContent>
          </EnhancedCard>
        </section>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <section className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Analytics & Reports</EnhancedCardTitle>
            <EnhancedCardDescription>
              Performance metrics and detailed analysis
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <MetricsGrid metrics={metrics} />
          </EnhancedCardContent>
        </EnhancedCard>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PerformanceOverview />
          <FeeAnalysis />
        </div>

        <GoalInsightsSummary />
        <RecentTrades />
        <DetailedReports />
      </section>
    </ProtectedRoute>
  );
}
