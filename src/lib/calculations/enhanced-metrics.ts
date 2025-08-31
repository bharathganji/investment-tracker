import { type Trade, type PerformanceMetrics } from "@/types";
import { calculatePerformanceMetrics } from "./returns";
import { 
  calculateWinLossRatio, 
  calculateAverageWin, 
  calculateAverageLoss, 
  calculateProfitFactor, 
  calculateWinRate, 
  calculateMaxDrawdown 
} from "./trading-metrics";

/**
 * Enhanced performance metrics with additional comprehensive metrics
 * @param trades - Array of trades
 * @returns Enhanced performance metrics object
 */
export const calculateEnhancedPerformanceMetrics = (
  trades: Trade[],
): PerformanceMetrics & {
  winLossRatio: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  winRate: number;
  maxDrawdown: number;
} => {
  const baseMetrics = calculatePerformanceMetrics(trades);
  
  return {
    ...baseMetrics,
    winLossRatio: calculateWinLossRatio(trades),
    averageWin: calculateAverageWin(trades),
    averageLoss: calculateAverageLoss(trades),
    profitFactor: calculateProfitFactor(trades),
    winRate: calculateWinRate(trades),
    maxDrawdown: calculateMaxDrawdown(trades),
  };
};