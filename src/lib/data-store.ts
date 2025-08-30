import { v4 as uuidv4 } from "uuid";
import { type Trade, type InvestmentGoal } from "@/types";
import { type CalculatedPortfolioHolding } from "@/types/portfolio";

const TRADES_KEY = "investment-tracker-trades";
const GOALS_KEY = "investment-tracker-goals";

// Trade functions
export const getTrades = (): Trade[] => {
  try {
    const tradesData = localStorage.getItem(TRADES_KEY);
    if (!tradesData) return [];

    const trades: unknown = JSON.parse(tradesData);
    // Convert date strings back to Date objects
    if (Array.isArray(trades)) {
      return trades.map((trade: unknown) => {
        if (typeof trade === "object" && trade !== null && "date" in trade) {
          return {
            ...(trade as Trade),
            date: new Date((trade as { date: string }).date),
          };
        }
        return trade as Trade;
      });
    }
    return [];
  } catch (error) {
    console.error("Error loading trades:", error);
    return [];
  }
};

export const saveTrade = (trade: Omit<Trade, "id">): Trade => {
  const trades = getTrades();
  const newTrade: Trade = {
    id: uuidv4(),
    ...trade,
  };
  trades.push(newTrade);
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  return newTrade;
};

export const updateTrade = (
  id: string,
  updatedTrade: Partial<Trade>,
): Trade | null => {
  const trades = getTrades();
  const index = trades.findIndex((trade) => trade.id === id);

  if (index === -1 || !trades[index]) return null;

  const trade: Trade = {
    ...trades[index],
    ...updatedTrade,
    id: trades[index].id, // Ensure id is preserved
    date: updatedTrade.date ?? trades[index].date // Ensure date is preserved
  };
  trades[index] = trade;
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
  return trade;
};

export const deleteTrade = (id: string): boolean => {
  const trades = getTrades();
  const initialLength = trades.length;
  const filteredTrades = trades.filter((trade) => trade.id !== id);

  if (filteredTrades.length === initialLength) return false;

  localStorage.setItem(TRADES_KEY, JSON.stringify(filteredTrades));
  return true;
};

// Goal functions
export const getGoals = (): InvestmentGoal[] => {
  try {
    const goalsData = localStorage.getItem(GOALS_KEY);
    if (!goalsData) return [];

    const goals: unknown = JSON.parse(goalsData);
    // Convert date strings back to Date objects
    if (Array.isArray(goals)) {
      return goals.map((goal: unknown) => {
        if (typeof goal === "object" && goal !== null && "deadline" in goal) {
          return {
            ...(goal as InvestmentGoal),
            deadline: new Date((goal as { deadline: string }).deadline),
          };
        }
        return goal as InvestmentGoal;
      });
    }
    return [];
  } catch (error) {
    console.error("Error loading goals:", error);
    return [];
  }
};

export const saveGoal = (goal: Omit<InvestmentGoal, "id">): InvestmentGoal => {
  const goals = getGoals();
  const newGoal: InvestmentGoal = {
    id: uuidv4(),
    ...goal,
  };
  goals.push(newGoal);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  return newGoal;
};

export const updateGoal = (
  id: string,
  updatedGoal: Partial<InvestmentGoal>,
): InvestmentGoal | null => {
  const goals = getGoals();
  const index = goals.findIndex((goal) => goal.id === id);

  if (index === -1 || !goals[index]) return null;

  const goal: InvestmentGoal = {
    ...goals[index],
    ...updatedGoal,
    id: goals[index].id, // Ensure id is preserved
    deadline: updatedGoal.deadline ?? goals[index].deadline // Ensure deadline is preserved
  };
  goals[index] = goal;
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  return goal;
};

export const deleteGoal = (id: string): boolean => {
  const goals = getGoals();
  const initialLength = goals.length;
  const filteredGoals = goals.filter((goal) => goal.id !== id);

  if (filteredGoals.length === initialLength) return false;

  localStorage.setItem(GOALS_KEY, JSON.stringify(filteredGoals));
  return true;
};

// Portfolio calculation functions
export const getPortfolioHoldings = (): CalculatedPortfolioHolding[] => {
  const trades = getTrades();
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
};
