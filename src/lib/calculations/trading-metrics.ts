import { type Trade } from "@/types";

/**
 * Calculate win/loss ratio
 * @param trades - Array of trades
 * @returns Win/loss ratio
 */
export const calculateWinLossRatio = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: number[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push(profitLoss);
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });
  
  const winningTrades = tradeResults.filter(result => result > 0);
  const losingTrades = tradeResults.filter(result => result < 0);
  
  if (losingTrades.length === 0) return winningTrades.length;
  return winningTrades.length / losingTrades.length;
};

/**
 * Calculate average win per trade
 * @param trades - Array of trades
 * @returns Average win per trade
 */
export const calculateAverageWin = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: number[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push(profitLoss);
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });
  
  const winningTrades = tradeResults.filter(result => result > 0);
  
  if (winningTrades.length === 0) return 0;
  
  const totalWins = winningTrades.reduce((sum, result) => sum + result, 0);
  
  return totalWins / winningTrades.length;
};

/**
 * Calculate average loss per trade
 * @param trades - Array of trades
 * @returns Average loss per trade
 */
export const calculateAverageLoss = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: number[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push(profitLoss);
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });
  
  const losingTrades = tradeResults.filter(result => result < 0);
  
  if (losingTrades.length === 0) return 0;
  
  const totalLosses = losingTrades.reduce((sum, result) => sum + Math.abs(result), 0);
  
  return totalLosses / losingTrades.length;
};

/**
 * Calculate profit factor
 * @param trades - Array of trades
 * @returns Profit factor
 */
export const calculateProfitFactor = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: number[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push(profitLoss);
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });
  
  let grossProfits = 0;
  let grossLosses = 0;
  
  tradeResults.forEach(result => {
    if (result > 0) {
      grossProfits += result;
    } else {
      grossLosses += Math.abs(result);
    }
  });
  
  if (grossLosses === 0) return grossProfits;
  return grossProfits / grossLosses;
};

/**
 * Calculate win rate percentage
 * @param trades - Array of trades
 * @returns Win rate percentage
 */
export const calculateWinRate = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: number[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push(profitLoss);
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });
  
  const winningTrades = tradeResults.filter(result => result > 0);
  
  if (tradeResults.length === 0) return 0;
  return (winningTrades.length / tradeResults.length) * 100;
};

/**
 * Calculate maximum drawdown
 * @param trades - Array of trades
 * @returns Maximum drawdown value
 */
export const calculateMaxDrawdown = (trades: Trade[]): number => {
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

  // Calculate profit/loss for each completed trade pair
  const tradeResults: { date: Date; pnl: number }[] = [];
  Object.values(tradesByAsset).forEach((assetTrades) => {
    // Sort trades by date
    const sortedTrades = [...assetTrades].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    let totalQuantity = 0;
    let totalCost = 0;
    
    sortedTrades.forEach((trade) => {
      if (trade.side === "buy") {
        totalQuantity += trade.quantity;
        totalCost += trade.quantity * trade.price + trade.fees;
      } else {
        // Sell trade
        if (totalQuantity > 0) {
          // Calculate profit/loss for this sell
          const avgCost = totalCost / totalQuantity;
          const sellValue = trade.quantity * trade.price - trade.fees;
          const costOfSold = trade.quantity * avgCost;
          const profitLoss = sellValue - costOfSold;
          
          tradeResults.push({ date: trade.date, pnl: profitLoss });
          
          // Update holding
          totalQuantity -= trade.quantity;
          totalCost -= costOfSold;
          
          // Ensure we don't go negative
          if (totalQuantity < 0) {
            totalQuantity = 0;
            totalCost = 0;
          }
        }
      }
    });
  });

  // Sort trade results by date
  const sortedResults = tradeResults.sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let peak = 0;
  let maxDrawdown = 0;
  let runningTotal = 0;
  
  sortedResults.forEach(result => {
    runningTotal += result.pnl;
    
    if (runningTotal > peak) {
      peak = runningTotal;
    }
    
    const drawdown = peak - runningTotal;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return maxDrawdown;
};