// Trade types
export interface Trade {
  id: string;
  date: Date;
  asset: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fees: number;
  notes?: string;
}

// Serializable version of Trade for Redux storage
export interface SerializableTrade {
  id: string;
  date: string; // ISO string representation of date
  asset: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fees: number;
  notes?: string;
}

// Portfolio holding types
export interface PortfolioHolding {
  asset: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}

// Goal types
export interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  progress: number;
 assignedAssets: string[];
}

// Serializable version of InvestmentGoal for Redux storage
export interface SerializableInvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO string representation of date
  progress: number;
  assignedAssets: string[];
}

// Analytics types
export interface PerformanceMetrics {
  totalTrades: number;
  totalProfitLoss: number;
  totalFeesPaid: number;
  roi: number;
  cagr: number;
  dailyReturns: number[];
  weeklyReturns: number[];
  monthlyReturns: number[];
}

// Trade form input types
export interface TradeFormData {
  date: Date;
  asset: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fees: number;
  notes?: string;
}

// Goal form input types
export interface GoalFormData {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  assignedAssets: string[];
}

// UI Component Props
export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // Percentage change
  icon?: React.ReactNode;
  className?: string;
}

export type ChartDataPoint = Record<string, string | number | Date>;

export interface ChartProps {
  data: ChartDataPoint[];
  dataKey: string;
  className?: string;
  height?: number;
  width?: number;
}

// Goal Analytics Types
export interface GoalAnalyticsMetrics {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  averageProgress: number;
  totalTargetAmount: number;
  totalCurrentAmount: number;
  overallCompletionRate: number;
  goalsNeedingAttention: number;
  onTrackGoals: number;
  offTrackGoals: number;
}

export interface GoalProgressAnalysis {
  goalId: string;
  goalName: string;
  currentProgress: number;
  requiredProgress: number;
  isOnTrack: boolean;
  daysRemaining: number;
  projectedCompletion: number;
  recommendedMonthlyContribution: number;
}

// Export schemas
export * from "./schemas";
