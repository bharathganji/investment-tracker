import { createAsyncThunk } from '@reduxjs/toolkit';
import { type CalculatedPortfolioHolding } from '@/types/portfolio';
import { setLoading, setError, setHoldings } from './portfolioSlice';

// Async thunk to calculate portfolio holdings based on trades
export const calculatePortfolioHoldings = createAsyncThunk(
  'portfolio/calculateHoldings',
  async (trades: any[], { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const holdings: Record<string, CalculatedPortfolioHolding> = {};
      
      // Process all trades to calculate holdings
      trades.forEach((trade) => {
        const { asset, side, quantity, price, fees } = trade;
        
        if (!holdings[asset]) {
          holdings[asset] = {
            asset,
            quantity: 0,
            totalCost: 0,
            averageCost: 0,
            currentValue: 0,
            unrealizedPnL: 0,
            unrealizedPnLPercentage: 0,
          };
        }
        
        const holding = holdings[asset];
        
        if (side === "buy") {
          const newTotalQuantity = holding.quantity + quantity;
          const newTotalCost = holding.totalCost + quantity * price + fees;
          
          holding.quantity = newTotalQuantity;
          holding.totalCost = newTotalCost;
          holding.averageCost =
          newTotalQuantity > 0 ? newTotalCost / newTotalQuantity : 0;
        } else {
          // Sell order
          const newTotalQuantity = holding.quantity - quantity;
          const costOfSold = quantity * holding.averageCost;
          const newTotalCost = holding.totalCost - costOfSold + fees;
          
          holding.quantity = Math.max(0, newTotalQuantity);
          holding.totalCost = newTotalQuantity > 0 ? newTotalCost : 0;
          // Average cost remains the same for sells
        }
        
        // For simplicity, assume current value is based on last trade price
        // In a real app, you'd fetch current market prices
        holding.currentValue = holding.quantity * price;
        holding.unrealizedPnL = holding.currentValue - holding.totalCost;
        holding.unrealizedPnLPercentage =
        holding.totalCost > 0
        ? (holding.unrealizedPnL / holding.totalCost) * 100
        : 0;
      });
      
      // Convert to array and filter out zero quantity holdings
      const holdingsArray = Object.values(holdings).filter((holding) => holding.quantity > 0);
      
      // Update the store
      dispatch(setHoldings(holdingsArray));
      dispatch(setLoading(false));
      
      return holdingsArray;
    } catch (error) {
      dispatch(setError("Failed to calculate portfolio holdings"));
      dispatch(setLoading(false));
      return rejectWithValue("Failed to calculate portfolio holdings");
    }
  }
);