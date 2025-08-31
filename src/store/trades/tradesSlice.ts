import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type SerializableTrade } from '@/types';

// Define the initial state
interface TradesState {
  trades: SerializableTrade[];
  loading: boolean;
  error: string | null;
}

const initialState: TradesState = {
  trades: [],
  loading: false,
  error: null,
};

export const tradesSlice = createSlice({
  name: 'trades',
  initialState,
  reducers: {
    setTrades: (state, action: PayloadAction<SerializableTrade[]>) => {
      state.trades = action.payload;
    },
    addTrade: (state, action: PayloadAction<SerializableTrade>) => {
      state.trades.push(action.payload);
    },
    updateTradeLocal: (state, action: PayloadAction<{ id: string; updatedTrade: Partial<SerializableTrade> }>) => {
      const index = state.trades.findIndex((trade) => trade.id === action.payload.id);
      if (index !== -1) {
        state.trades[index] = {
          ...state.trades[index],
          ...action.payload.updatedTrade,
        } as SerializableTrade;
      }
    },
    removeTrade: (state, action: PayloadAction<string>) => {
      state.trades = state.trades.filter((trade) => trade.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setTrades, addTrade, updateTradeLocal, removeTrade, setLoading, setError } = tradesSlice.actions;

export default tradesSlice.reducer;