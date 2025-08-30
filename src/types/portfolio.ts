import { PortfolioHolding } from "@/types";

export interface CalculatedPortfolioHolding {
  asset: string;
  quantity: number;
  totalCost: number;
  averageCost: number;
  currentValue: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}
