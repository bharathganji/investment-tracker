"use client";

import { useState, useEffect } from "react";
import { getTrades, getPortfolioHoldings } from "@/lib/data-store";
import { calculatePerformanceMetrics } from "@/lib/calculations";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { AnimatedCardGrid } from "@/components/animated-card-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { financialColors } from "@/lib/utils";
import { useFinancialCountUp } from "@/hooks/use-financial-count-up";

interface DashboardStats {
  totalTrades: number;
  totalInvestment: number;
  portfolioValue: number;
  totalPnL: number;
  totalFees: number;
  roi: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTrades: 0,
    totalInvestment: 0,
    portfolioValue: 0,
    totalPnL: 0,
    totalFees: 0,
    roi: 0,
  });
  const [loading, setLoading] = useState(true);
  
  // Financial count-up hooks
  const totalTradesCount = useFinancialCountUp(stats.totalTrades, 1000, 0);
  const portfolioValueCount = useFinancialCountUp(stats.portfolioValue, 1000, 2);
  const totalPnLCount = useFinancialCountUp(stats.totalPnL, 1000, 2);
  const roiCount = useFinancialCountUp(stats.roi, 1000, 2);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    try {
      const trades = getTrades();
      const holdings = getPortfolioHoldings();
      const performance = calculatePerformanceMetrics(trades);

      const totalInvestment = trades
        .filter((trade) => trade.side === "buy")
        .reduce(
          (sum, trade) => sum + (trade.quantity * trade.price + trade.fees),
          0,
        );

      const portfolioValue = holdings.reduce(
        (sum, holding) => sum + holding.currentValue,
        0,
      );

      setStats({
        totalTrades: trades.length,
        totalInvestment,
        portfolioValue,
        totalPnL: performance.totalProfitLoss,
        totalFees: performance.totalFeesPaid,
        roi: performance.roi,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AnimatedCardGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <EnhancedCard key={i} className="p-6" animateOnHover>
            <EnhancedCardHeader className="mb-4 p-0">
              <Skeleton className="h-4 w-3/4" />
            </EnhancedCardHeader>
            <EnhancedCardContent className="p-0">
              <Skeleton className="h-8 w-1/2" />
            </EnhancedCardContent>
          </EnhancedCard>
        ))}
      </AnimatedCardGrid>
    );
  }

  return (
    <AnimatedCardGrid>
      <EnhancedCard animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground">
            Total Trades
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-3xl font-bold financial-number">{totalTradesCount.formattedValue}</div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground">
            Portfolio Value
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className={`text-3xl font-bold financial-number ${portfolioValueCount.value >= 0 ? financialColors.profit : financialColors.loss}`}>
            ${portfolioValueCount.formattedValue}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground">
            Total P&L
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div
            className={`text-3xl font-bold financial-number ${totalPnLCount.value >= 0 ? financialColors.profit : financialColors.loss}`}
          >
            ${totalPnLCount.formattedValue}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground">
            ROI
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div
            className={`text-3xl font-bold financial-number ${roiCount.value >= 0 ? financialColors.profit : financialColors.loss}`}
          >
            {roiCount.formattedValue}%
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </AnimatedCardGrid>
  );
}
