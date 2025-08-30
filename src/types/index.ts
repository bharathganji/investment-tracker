// Trade types
export interface Trade {
  id: string;
  date: Date;
  asset: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fees: number;
  tradeType: "maker" | "taker";
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
  tradeType: "maker" | "taker";
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

// Export schemas
export * from "./schemas";
