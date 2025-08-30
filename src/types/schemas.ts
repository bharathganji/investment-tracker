import { z } from "zod";

// Zod schema for Trade
export const TradeSchema = z.object({
  id: z.string(),
  date: z.date(),
  asset: z.string(),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  price: z.number().nonnegative(),
  fees: z.number().nonnegative(),
  tradeType: z.enum(["maker", "taker"]),
  notes: z.string().optional(),
});

// Zod schema for PortfolioHolding
export const PortfolioHoldingSchema = z.object({
  asset: z.string(),
  quantity: z.number(),
  averageCost: z.number(),
  currentValue: z.number(),
  totalCost: z.number(),
  unrealizedPnL: z.number(),
  unrealizedPnLPercentage: z.number(),
});

// Zod schema for InvestmentGoal
export const InvestmentGoalSchema = z.object({
  id: z.string(),
  name: z.string(),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative(),
  deadline: z.date(),
  progress: z.number().min(0).max(100),
  assignedAssets: z.array(z.string()),
});

// Zod schema for PerformanceMetrics
export const PerformanceMetricsSchema = z.object({
  totalTrades: z.number().nonnegative(),
  totalProfitLoss: z.number(),
  totalFeesPaid: z.number().nonnegative(),
  roi: z.number(),
  cagr: z.number(),
  dailyReturns: z.array(z.number()),
  weeklyReturns: z.array(z.number()),
  monthlyReturns: z.array(z.number()),
});

// Zod schema for TradeFormData
export const TradeFormDataSchema = z.object({
  date: z.date(),
  asset: z.string().min(1, "Asset is required"),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive("Quantity must be positive"),
  price: z.number().nonnegative("Price cannot be negative"),
  fees: z.number().nonnegative("Fees cannot be negative"),
  tradeType: z.enum(["maker", "taker"]),
  notes: z.string().optional(),
});

// Zod schema for GoalFormData
export const GoalFormDataSchema = z.object({
  name: z.string().min(1, "Goal name is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().nonnegative("Current amount cannot be negative"),
  deadline: z.date(),
  assignedAssets: z.array(z.string()),
});

// Type inference from Zod schemas
export type Trade = z.infer<typeof TradeSchema>;
export type PortfolioHolding = z.infer<typeof PortfolioHoldingSchema>;
export type InvestmentGoal = z.infer<typeof InvestmentGoalSchema>;
export type PerformanceMetrics = z.infer<typeof PerformanceMetricsSchema>;
export type TradeFormData = z.infer<typeof TradeFormDataSchema>;
export type GoalFormData = z.infer<typeof GoalFormDataSchema>;