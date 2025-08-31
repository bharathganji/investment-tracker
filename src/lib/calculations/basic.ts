import {
  type Trade,
  type PortfolioHolding,
} from "@/types";

/**
 * Calculate the total value of a portfolio
 * @param holdings - Array of portfolio holdings
 * @returns Total portfolio value
 */
export const calculatePortfolioValue = (
  holdings: PortfolioHolding[],
): number => {
  return holdings.reduce((total, holding) => total + holding.currentValue, 0);
};

/**
 * Calculate profit and loss from a list of trades
 * @param trades - Array of trades
 * @returns Total profit and loss
 */
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

/**
 * Calculate Return on Investment (ROI) percentage
 * @param initialValue - Initial investment value
 * @param finalValue - Final investment value
 * @returns ROI percentage
 */
export const calculateROI = (
  initialValue: number,
  finalValue: number,
): number => {
  if (initialValue === 0) return 0;
  return ((finalValue - initialValue) / initialValue) * 100;
};

/**
 * Calculate Compound Annual Growth Rate (CAGR) percentage
 * @param initialValue - Initial investment value
 * @param finalValue - Final investment value
 * @param years - Number of years
 * @returns CAGR percentage
 */
export const calculateCAGR = (
  initialValue: number,
  finalValue: number,
  years: number,
): number => {
  if (initialValue === 0 || years === 0) return 0;
  return (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
};

/**
 * Calculate total fees paid from trades
 * @param trades - Array of trades
 * @returns Total fees paid
 */
export const calculateFeesPaid = (trades: Trade[]): number => {
  return trades.reduce((total, trade) => total + trade.fees, 0);
};