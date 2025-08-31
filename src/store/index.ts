import { configureStore } from "@reduxjs/toolkit";
import tradesReducer from "./trades/tradesSlice";
import goalsReducer from "./goals/goalsSlice";
import portfolioReducer from "./portfolio/portfolioSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  type SerializableTrade,
  type SerializableInvestmentGoal,
} from "@/types";
import { type CalculatedPortfolioHolding } from "@/types/portfolio";

// Define the state structure
interface TradesState {
  trades: SerializableTrade[];
  loading: boolean;
  error: string | null;
}

interface GoalsState {
  goals: SerializableInvestmentGoal[];
  loading: boolean;
  error: string | null;
}

interface PortfolioState {
  holdings: CalculatedPortfolioHolding[];
  loading: boolean;
  error: string | null;
}

// Configure persistence for each slice
const tradesPersistConfig = {
  key: "trades",
  storage,
};

const goalsPersistConfig = {
  key: "goals",
  storage,
};

const portfolioPersistConfig = {
  key: "portfolio",
  storage,
};

const persistedTradesReducer = persistReducer(
  tradesPersistConfig,
  tradesReducer,
);
const persistedGoalsReducer = persistReducer(goalsPersistConfig, goalsReducer);
const persistedPortfolioReducer = persistReducer(
  portfolioPersistConfig,
  portfolioReducer,
);

export const makeStore = () => {
  return configureStore({
    reducer: {
      trades: persistedTradesReducer,
      goals: persistedGoalsReducer,
      portfolio: persistedPortfolioReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Define RootState with proper structure for persisted state
export interface RootState {
  trades: TradesState;
  goals: GoalsState;
  portfolio: PortfolioState;
}

export type AppDispatch = AppStore["dispatch"];

// Export all selectors from their respective files
export * from "./trades/tradesSelectors";
export * from "./goals/goalsSelectors";
export * from "./portfolio/portfolioSelectors";

export const persistor = persistStore(makeStore());
