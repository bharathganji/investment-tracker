import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";
import { type Trade, type SerializableTrade } from '@/types';
import { TradeSchema } from '@/types/schemas';
import { toSerializableTrade, fromSerializableTrade } from '@/lib/utils';
import { setLoading, setError, addTrade, setTrades, updateTradeLocal, removeTrade } from './tradesSlice';

// Async thunk to load trades from localStorage
export const loadTrades = createAsyncThunk(
  'trades/loadTrades',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const tradesData = localStorage.getItem("investment-tracker-trades");
      if (!tradesData) {
        dispatch(setTrades([]));
        dispatch(setLoading(false));
        return [];
      }
      
      const trades: unknown = JSON.parse(tradesData);
      // Keep dates as ISO strings for Redux serialization compatibility
      if (Array.isArray(trades)) {
        const serializableTrades = trades.map((trade) => {
          if (typeof trade === "object" && trade !== null && "date" in trade) {
            // Ensure date is a string for Redux serialization compatibility
            const tradeObj = trade as Record<string, unknown>;
            return {
              ...tradeObj,
              date: typeof tradeObj.date === 'string' ? tradeObj.date : new Date(tradeObj.date as string).toISOString(),
            } as SerializableTrade;
          }
          return trade as SerializableTrade;
                  }).map(trade => {
                    // Ensure fees are rounded to 2 decimal places when loading
                    if (typeof trade === "object" && trade !== null && "fees" in trade) {
                      return {
                        ...trade,
                        fees: Math.round((trade as { fees: number }).fees * 100) / 100
                      } as SerializableTrade;
                    }
                    return trade as SerializableTrade;
                  });
        dispatch(setTrades(serializableTrades));
        dispatch(setLoading(false));
        return serializableTrades;
      }
      dispatch(setTrades([]));
      dispatch(setLoading(false));
      return [];
    } catch (error) {
      dispatch(setError("Failed to load trades from localStorage"));
      dispatch(setLoading(false));
      return rejectWithValue("Failed to load trades from localStorage");
    }
  }
);

// Async thunk to save a trade
export const saveTrade = createAsyncThunk(
  'trades/saveTrade',
  async (tradeData: Omit<Trade, "id">, { dispatch, rejectWithValue }) => {
    try {
      // Validate the trade data
      const validatedTrade = TradeSchema.omit({ id: true }).parse(tradeData);
      
      // Ensure fees are rounded to 2 decimal places before saving
            const tradeWithRoundedFees = {
              ...validatedTrade,
              fees: validatedTrade.fees !== undefined ? Math.round(validatedTrade.fees * 100) / 100 : 0,
            };
            
            const newTrade: Trade = {
              id: uuidv4(),
              ...tradeWithRoundedFees,
            };
      
      // Convert to serializable format for Redux
      const serializableTrade = toSerializableTrade(newTrade);
      
      // Save to localStorage
      const tradesData = localStorage.getItem("investment-tracker-trades") ?? "[]";
      const trades: unknown[] = JSON.parse(tradesData) as unknown[];
      trades.push(newTrade);
      console.log("Saving updated trades to localStorage:", trades);
            localStorage.setItem("investment-tracker-trades", JSON.stringify(trades));
      
      // Update the store
      dispatch(addTrade(serializableTrade));
      
      return serializableTrade;
    } catch (error) {
      dispatch(setError("Failed to validate trade data"));
      return rejectWithValue("Failed to validate trade data");
    }
  }
);

// Async thunk to update a trade
export const updateTrade = createAsyncThunk(
  'trades/updateTrade',
  async ({ id, updatedTrade }: { id: string; updatedTrade: Partial<Trade> }, { dispatch, rejectWithValue }) => {
      console.log("updateTrade called with:", { id, updatedTrade });
      try {
        // Update in localStorage
              console.log("Updating trade in localStorage");
              const tradesData = localStorage.getItem("investment-tracker-trades") ?? "[]";
      const trades: Array<Record<string, unknown>> = JSON.parse(tradesData) as Array<Record<string, unknown>>;
      const index = trades.findIndex((trade) => {
        if (typeof trade === "object" && trade !== null && "id" in trade) {
          return (trade as { id: string }).id === id;
        }
        return false;
      });
      
      console.log("Trade index found:", index);
            if (index !== -1) {
        // Merge the updated trade data with the existing trade
        const updatedTradeData = {
                  ...trades[index],
                  ...updatedTrade,
                  id: (trades[index] as { id: string }).id, // Ensure id is preserved
                };
                
                // Ensure fees are rounded to 2 decimal places in localStorage data
                if (updatedTradeData.fees !== undefined) {
                  updatedTradeData.fees = Math.round(updatedTradeData.fees * 100) / 100;
                }
                
                trades[index] = updatedTradeData;
        
        // Convert to serializable format for Redux
        // Create a proper Trade object from the updated trade data
        const updatedTradeObj: Trade = {
          id: (trades[index] as { id: string }).id,
          date: updatedTrade.date ? new Date(updatedTrade.date) : new Date((trades[index] as { date: string | Date }).date),
          asset: updatedTrade.asset ?? (trades[index] as { asset: string }).asset,
          side: updatedTrade.side ?? (trades[index] as { side: "buy" | "sell" }).side,
          quantity: updatedTrade.quantity ?? (trades[index] as { quantity: number }).quantity,
          price: updatedTrade.price ?? (trades[index] as { price: number }).price,
          fees: updatedTrade.fees !== undefined ? Math.round(updatedTrade.fees * 100) / 100 : (trades[index] as { fees: number }).fees,
          notes: updatedTrade.notes ?? (trades[index] as { notes?: string }).notes,
        };
        const serializableTrade = toSerializableTrade(updatedTradeObj);
        
        localStorage.setItem("investment-tracker-trades", JSON.stringify(trades));
        
        // Update the store
                console.log("Dispatching updateTradeLocal action with:", { id, updatedTrade: serializableTrade });
                dispatch(updateTradeLocal({ id, updatedTrade: serializableTrade }));
        
        return { id, updatedTrade: serializableTrade };
      }
      
      console.log("Trade not found");
            dispatch(setError("Trade not found"));
            return rejectWithValue("Trade not found");
    } catch (error) {
      console.log("Error updating trade:", error);
            dispatch(setError("Failed to update trade"));
            return rejectWithValue("Failed to update trade");
    }
  }
);

// Async thunk to delete a trade
export const deleteTrade = createAsyncThunk(
  'trades/deleteTrade',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      // Delete from localStorage
      const tradesData = localStorage.getItem("investment-tracker-trades") ?? "[]";
      const trades: Array<Record<string, unknown>> = JSON.parse(tradesData) as Array<Record<string, unknown>>;
      const initialLength = trades.length;
      const filteredTrades = trades.filter((trade) => {
        if (typeof trade === "object" && trade !== null && "id" in trade) {
          return (trade as { id: string }).id !== id;
        }
        return true;
      });
      
      if (filteredTrades.length === initialLength) {
        dispatch(setError("Trade not found"));
        return rejectWithValue("Trade not found");
      }
      
      localStorage.setItem("investment-tracker-trades", JSON.stringify(filteredTrades));
      
      // Update the store
      dispatch(removeTrade(id));
      
      return id;
    } catch (error) {
      dispatch(setError("Failed to delete trade"));
      return rejectWithValue("Failed to delete trade");
    }
  }
);