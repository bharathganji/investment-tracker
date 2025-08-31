import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { type CalculatedPortfolioHolding } from '@/types/portfolio';

// Define the initial state
interface PortfolioState {
  holdings: CalculatedPortfolioHolding[];
  loading: boolean;
  error: string | null;
}

const initialState: PortfolioState = {
  holdings: [],
  loading: false,
  error: null,
};

// Async thunk to calculate portfolio holdings based on trades
export const calculatePortfolioHoldings = createAsyncThunk(
  'portfolio/calculateHoldings',
  async (trades: any[], { rejectWithValue }) => {
    try {
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
      return Object.values(holdings).filter((holding) => holding.quantity > 0);
    } catch (error) {
      return rejectWithValue("Failed to calculate portfolio holdings");
    }
  }
);

export const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    setHoldings: (state, action: PayloadAction<CalculatedPortfolioHolding[]>) => {
      state.holdings = action.payload;
    },
    addHolding: (state, action: PayloadAction<CalculatedPortfolioHolding>) => {
      state.holdings.push(action.payload);
    },
    updateHolding: (state, action: PayloadAction<CalculatedPortfolioHolding>) => {
      const index = state.holdings.findIndex((holding) => holding.asset === action.payload.asset);
      if (index !== -1) {
        state.holdings[index] = action.payload;
      }
    },
    removeHolding: (state, action: PayloadAction<string>) => {
      state.holdings = state.holdings.filter((holding) => holding.asset !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Calculate holdings
      .addCase(calculatePortfolioHoldings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePortfolioHoldings.fulfilled, (state, action: PayloadAction<CalculatedPortfolioHolding[]>) => {
        state.loading = false;
        state.holdings = action.payload;
      })
      .addCase(calculatePortfolioHoldings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to calculate portfolio holdings";
      });
  },
});

export const { setHoldings, addHolding, updateHolding, removeHolding } = portfolioSlice.actions;

export default portfolioSlice.reducer;