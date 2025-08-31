"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadTrades } from "@/store/trades/tradesThunks";
import { loadGoals } from "@/store/goals/goalsThunks";
import { calculatePortfolioHoldings } from "@/store/portfolio/portfolioThunks";
import { calculatePerformanceMetrics } from "@/lib/calculations/returns";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { AnimatedCardGrid } from "@/components/animated-card-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { financialColors } from "@/lib/utils";
import { useFinancialCountUp } from "@/hooks/use-financial-count-up";
import { motion } from "framer-motion";
import { type Trade } from "@/types";
import { type CalculatedPortfolioHolding } from "@/types/portfolio";

interface DashboardStats {
  totalTrades: number;
  totalInvestment: number;
  portfolioValue: number;
  totalPnL: number;
  totalFees: number;
  roi: number;
}

export function DashboardStats() {
  const dispatch = useAppDispatch();
  
  // Use proper selectors instead of directly accessing state
  const trades = useAppSelector((state) => state.trades.trades);
  const goals = useAppSelector((state) => state.goals.goals);
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const tradesLoading = useAppSelector((state) => state.trades.loading);
  const portfolioLoading = useAppSelector((state) => state.portfolio.loading);
  
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
  const portfolioValueCount = useFinancialCountUp(stats.portfolioValue, 100, 2);
  const totalPnLCount = useFinancialCountUp(stats.totalPnL, 1000, 2);
  const roiCount = useFinancialCountUp(stats.roi, 1000, 2);

  useEffect(() => {
    // Load data from Redux store
    const loadData = async () => {
      setLoading(true);
      try {
        // Load trades and goals
        await Promise.all([
          dispatch(loadTrades()).unwrap(),
          dispatch(loadGoals()).unwrap()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    void loadData();
  }, [dispatch]);

  useEffect(() => {
    // Calculate portfolio holdings when trades change
    if (trades.length > 0) {
      // Convert serializable trades back to Trade objects with Date instances
      const tradesWithDates = trades.map(trade => ({
        ...trade,
        date: new Date(trade.date)
      }));
      void dispatch(calculatePortfolioHoldings(tradesWithDates));
    }
  }, [trades.length, dispatch]); // Depend on trades.length to trigger when trades change

  useEffect(() => {
    // Calculate stats when data is loaded
    if (trades.length > 0 && !tradesLoading) {
      calculateStats();
    }
  }, [trades.length, holdings.length, tradesLoading]); // Depend on actual arrays to trigger recalculations

 const calculateStats = () => {
    try {
      // Convert serializable trades back to Trade objects with Date instances
      const tradesWithDates = trades.map(trade => ({
        ...trade,
        date: new Date(trade.date)
      }));

      const performance = calculatePerformanceMetrics(tradesWithDates);

      const totalInvestment = tradesWithDates
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
      
      setLoading(false);
    } catch (error) {
      console.error("Error calculating dashboard data:", error);
      setLoading(false);
    }
  };

  // Show loading state while data is being fetched
  if (loading || tradesLoading || portfolioLoading) {
    return (
      <AnimatedCardGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <EnhancedCard key={i} className="p-6 shadow-md rounded-xl" animateOnHover>
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
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <EnhancedCard className="shadow-md hover:shadow-lg transition-shadow duration-30 rounded-xl" animateOnHover>
          <EnhancedCardHeader className="pb-2">
            <EnhancedCardTitle className="text-sm font-medium text-muted-foreground">
              Total Trades
            </EnhancedCardTitle>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="text-3xl font-bold financial-number">{totalTradesCount.formattedValue}</div>
          </EnhancedCardContent>
        </EnhancedCard>
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <EnhancedCard className="shadow-md hover:shadow-lg transition-shadow duration-30 rounded-xl" animateOnHover>
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
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <EnhancedCard className="shadow-md hover:shadow-lg transition-shadow duration-30 rounded-xl" animateOnHover>
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
      </motion.div>

      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <EnhancedCard className="shadow-md hover:shadow-lg transition-shadow duration-30 rounded-xl" animateOnHover>
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
      </motion.div>
    </AnimatedCardGrid>
  );
}
