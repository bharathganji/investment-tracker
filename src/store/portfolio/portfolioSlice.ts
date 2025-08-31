import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setHoldings, addHolding, updateHolding, removeHolding, setLoading, setError } = portfolioSlice.actions;

export default portfolioSlice.reducer;