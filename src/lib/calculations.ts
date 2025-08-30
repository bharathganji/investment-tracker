import {
  type Trade,
  type PortfolioHolding,
  type PerformanceMetrics,
} from "@/types";

export const calculatePortfolioValue = (
  holdings: PortfolioHolding[],
): number => {
  return holdings.reduce((total, holding) => total + holding.currentValue, 0);
};

export const calculatePnL = (trades: Trade[]): number => {
  let totalPnL = 0;

  // Group trades by asset
  const tradesByAsset: Record<string, Trade[]> = {};
  trades.forEach((trade) => {
    if (trade.asset) {
      const assetKey = trade.asset;
      if (!tradesByAsset[assetKey]) {
        tradesByAsset[assetKey] = [];
      }
      tradesByAsset[assetKey].push(trade);
    }
  });

  // Calculate PnL for each asset
  Object.values(tradesByAsset).forEach((assetTrades) => {
    if (assetTrades.length > 0) {
      let totalCost = 0;
      let totalQuantity = 0;
      let totalRevenue = 0;

      assetTrades.forEach((trade) => {
        if (trade.side === "buy") {
          totalCost += trade.quantity * trade.price + trade.fees;
          totalQuantity += trade.quantity;
        } else {
          totalRevenue += trade.quantity * trade.price - trade.fees;
          totalQuantity -= trade.quantity;
        }
      });

      // For assets still held, we need current market value (simplified as last trade price)
      const lastTrade = assetTrades[assetTrades.length - 1];
      if (lastTrade) {
        const currentValue = totalQuantity * lastTrade.price;
        totalPnL += totalRevenue + currentValue - totalCost;
      }
    }
  });

  return totalPnL;
};

export const calculateROI = (
  initialValue: number,
  finalValue: number,
): number => {
  if (initialValue === 0) return 0;
  return ((finalValue - initialValue) / initialValue) * 100;
};

export const calculateCAGR = (
  initialValue: number,
  finalValue: number,
  years: number,
): number => {
  if (initialValue === 0 || years === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
};

export const calculateFeesPaid = (trades: Trade[]): number => {
  return trades.reduce((total, trade) => total + trade.fees, 0);
};

export const calculateDailyReturns = (trades: Trade[]): number[] => {
  // Group trades by date and calculate daily PnL
  const dailyTrades: Record<string, Trade[]> = {};

  trades.forEach((trade) => {
    const dateKey = trade.date.toISOString().split("T")[0];
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
