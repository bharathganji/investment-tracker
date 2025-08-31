import {
  type Trade,
  type PerformanceMetrics,
} from "@/types";
import { calculateFeesPaid, calculatePnL, calculateROI, calculateCAGR } from "./basic";

/**
 * Calculate daily returns from trades
 * @param trades - Array of trades
 * @returns Array of daily cumulative returns
 */
export const calculateDailyReturns = (trades: Trade[]): number[] => {
  // Group trades by date and calculate daily PnL
  const dailyTrades: Record<string, Trade[]> = {};

  trades.forEach((trade) => {
    const dateKey = trade.date instanceof Date
      ? trade.date.toISOString().split("T")[0]
      : typeof trade.date === "string"
      ? new Date(trade.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];
    if (dateKey) {
      if (!dailyTrades[dateKey]) {
        dailyTrades[dateKey] = [];
      }
      dailyTrades[dateKey].push(trade);
    }
  });

  const dailyReturns: number[] = [];
  let cumulativeValue = 0;

  Object.keys(dailyTrades)
    .sort()
    .forEach((date) => {
      const dayTrades = dailyTrades[date];
      if (dayTrades) {
        let dayPnL = 0;

        dayTrades.forEach((trade) => {
          if (trade.side === "buy") {
            dayPnL -= trade.quantity * trade.price + trade.fees;
          } else {
            dayPnL += trade.quantity * trade.price - trade.fees;
          }
        });

        cumulativeValue += dayPnL;
        dailyReturns.push(cumulativeValue);
      }
    });

  return dailyReturns;
};

/**
 * Calculate comprehensive performance metrics
 * @param trades - Array of trades
 * @returns Performance metrics object
 */
export const calculatePerformanceMetrics = (
  trades: Trade[],
): PerformanceMetrics => {
  const totalTrades = trades.length;
  const totalFeesPaid = calculateFeesPaid(trades);
  const totalPnL = calculatePnL(trades);

  // Calculate ROI (simplified)
  const totalInvestment = trades
    .filter((trade) => trade.side === "buy")
    .reduce(
      (sum, trade) => sum + (trade.quantity * trade.price + trade.fees),
      0,
    );

  const roi = calculateROI(totalInvestment, totalInvestment + totalPnL);

  // Calculate CAGR (simplified - assume 1 year)
  const cagr = calculateCAGR(totalInvestment, totalInvestment + totalPnL, 1);

  // Calculate returns (simplified)
  const dailyReturns = calculateDailyReturns(trades);
  const weeklyReturns = dailyReturns.filter((_, index) => index % 7 === 0);
  const monthlyReturns = dailyReturns.filter((_, index) => index % 30 === 0);

  return {
    totalTrades,
    totalProfitLoss: totalPnL,
    totalFeesPaid,
    roi,
    cagr,
    dailyReturns,
    weeklyReturns,
    monthlyReturns,
  };
};