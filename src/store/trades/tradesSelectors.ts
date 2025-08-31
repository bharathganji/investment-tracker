import { createSelector } from "@reduxjs/toolkit";
import { type RootState } from "../index";

// Basic selectors
export const selectTradesState = (state: RootState) => state.trades;

export const selectTrades = (state: RootState) => state.trades.trades;

export const selectTradesLoading = (state: RootState) => state.trades.loading;

export const selectTradesError = (state: RootState) => state.trades.error;

// Memoized selectors using createSelector
export const selectTradesCount = createSelector(
  [selectTrades],
  (trades) => trades.length,
);

export const selectBuyTrades = createSelector([selectTrades], (trades) =>
  trades.filter((trade) => trade.side === "buy"),
);

export const selectSellTrades = createSelector([selectTrades], (trades) =>
  trades.filter((trade) => trade.side === "sell"),
);

export const selectTradesByAsset = createSelector(
  [selectTrades, (_, asset: string) => asset],
  (trades, asset) => trades.filter((trade) => trade.asset === asset),
);

export const selectTradesByDateRange = createSelector(
  [
    selectTrades,
    (_, startDate: Date, endDate: Date) => ({ startDate, endDate }),
  ],
  (trades, { startDate, endDate }) =>
    trades.filter((trade) => {
      const tradeDate = new Date(trade.date);
      return tradeDate >= startDate && tradeDate <= endDate;
    }),
);

export const selectTotalFees = createSelector([selectTrades], (trades) =>
  trades.reduce((sum, trade) => sum + trade.fees, 0),
);

export const selectTotalBuyAmount = createSelector(
  [selectBuyTrades],
  (buyTrades) =>
    buyTrades.reduce(
      (sum, trade) => sum + (trade.quantity * trade.price + trade.fees),
      0,
    ),
);

export const selectTotalSellAmount = createSelector(
  [selectSellTrades],
  (sellTrades) =>
    sellTrades.reduce(
      (sum, trade) => sum + (trade.quantity * trade.price - trade.fees),
      0,
    ),
);

export const selectTradeById = createSelector(
  [selectTrades, (_, id: string) => id],
  (trades, id) => trades.find((trade) => trade.id === id) ?? null,
);

export const selectUniqueAssets = createSelector([selectTrades], (trades) => [
  ...new Set(trades.map((trade) => trade.asset)),
]);

export const selectTradesSortedByDate = createSelector(
  [selectTrades],
  (trades) =>
    [...trades].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
);
