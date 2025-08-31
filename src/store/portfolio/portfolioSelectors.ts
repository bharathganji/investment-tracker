import { createSelector } from '@reduxjs/toolkit';
import { type RootState } from '../index';
import { type CalculatedPortfolioHolding } from '@/types/portfolio';

// Basic selectors
export const selectPortfolioState = (state: RootState) => state.portfolio;

export const selectPortfolioHoldings = (state: RootState) => state.portfolio.holdings;

export const selectPortfolioLoading = (state: RootState) => state.portfolio.loading;

export const selectPortfolioError = (state: RootState) => state.portfolio.error;

// Memoized selectors using createSelector
export const selectPortfolioHoldingsCount = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.length
);

export const selectTotalPortfolioValue = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.reduce((sum, holding) => sum + holding.currentValue, 0)
);

export const selectTotalPortfolioCost = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.reduce((sum, holding) => sum + holding.totalCost, 0)
);

export const selectTotalUnrealizedPnL = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.reduce((sum, holding) => sum + holding.unrealizedPnL, 0)
);

export const selectPortfolioROI = createSelector(
  [selectTotalPortfolioValue, selectTotalPortfolioCost],
  (totalValue, totalCost) => totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 10 : 0
);

export const selectHoldingByAsset = createSelector(
  [selectPortfolioHoldings, (_, asset: string) => asset],
  (holdings, asset) => holdings.find(holding => holding.asset === asset) ?? null
);

export const selectTopHoldings = createSelector(
  [selectPortfolioHoldings],
  (holdings) => [...holdings].sort((a, b) => b.currentValue - a.currentValue).slice(0, 5)
);

export const selectHoldingsSortedByPnL = createSelector(
  [selectPortfolioHoldings],
  (holdings) => [...holdings].sort((a, b) => b.unrealizedPnL - a.unrealizedPnL)
);

export const selectProfitableHoldings = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.filter(holding => holding.unrealizedPnL > 0)
);

export const selectUnprofitableHoldings = createSelector(
  [selectPortfolioHoldings],
  (holdings) => holdings.filter(holding => holding.unrealizedPnL < 0)
);