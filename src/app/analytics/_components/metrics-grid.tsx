import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Tooltip } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MetricsGridProps {
  metrics: {
    totalTrades: number;
    totalProfitLoss: number;
    totalFeesPaid: number;
    roi: number;
    cagr: number;
    winLossRatio: number;
    averageWin: number;
    averageLoss: number;
    profitFactor: number;
    winRate: number;
    maxDrawdown: number;
  };
}

// Metric definitions
const METRIC_DEFINITIONS = {
  totalTrades: "Total number of trades executed",
  totalProfitLoss: "Total profit or loss from all trades",
  totalFeesPaid: "Total fees paid for all trades",
  roi: "Return on Investment - percentage gain or loss relative to total investment",
  cagr: "Compound Annual Growth Rate - annualized return over the investment period",
  winLossRatio: "Ratio of winning trades to losing trades",
  averageWin: "Average profit per winning trade",
  averageLoss: "Average loss per losing trade",
  profitFactor: "Gross profits divided by gross losses",
  winRate: "Percentage of trades that were profitable",
  maxDrawdown: "Maximum peak-to-trough decline in portfolio value"
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Total Trades
            <Tooltip content={METRIC_DEFINITIONS.totalTrades}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold">{metrics.totalTrades}</div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Total P&L
            <Tooltip content={METRIC_DEFINITIONS.totalProfitLoss}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div
            className={`text-2xl font-bold ${metrics.totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            ${metrics.totalProfitLoss.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Fees Paid
            <Tooltip content={METRIC_DEFINITIONS.totalFeesPaid}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-foreground">
            ${metrics.totalFeesPaid.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            ROI
            <Tooltip content={METRIC_DEFINITIONS.roi}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div
            className={`text-2xl font-bold ${metrics.roi >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {metrics.roi.toFixed(2)}%
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            CAGR
            <Tooltip content={METRIC_DEFINITIONS.cagr}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div
            className={`text-2xl font-bold ${metrics.cagr >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {metrics.cagr.toFixed(2)}%
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Win/Loss Ratio
            <Tooltip content={METRIC_DEFINITIONS.winLossRatio}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.winLossRatio.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Avg Win
            <Tooltip content={METRIC_DEFINITIONS.averageWin}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-green-600">
            ${metrics.averageWin.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Avg Loss
            <Tooltip content={METRIC_DEFINITIONS.averageLoss}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-red-600">
            ${metrics.averageLoss.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Profit Factor
            <Tooltip content={METRIC_DEFINITIONS.profitFactor}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.profitFactor.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Win Rate
            <Tooltip content={METRIC_DEFINITIONS.winRate}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-foreground">
            {metrics.winRate.toFixed(2)}%
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <EnhancedCardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            Max Drawdown
            <Tooltip content={METRIC_DEFINITIONS.maxDrawdown}>
              <InfoIcon className="h-4 w-4 text-muted-foreground" />
            </Tooltip>
          </EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold text-red-600">
            ${metrics.maxDrawdown.toFixed(2)}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
}