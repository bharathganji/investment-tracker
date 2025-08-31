import { lazy, Suspense } from "react";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
} from "@/components/ui/enhanced-card";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load the chart components
const PerformanceOverviewChart = lazy(() =>
  import("@/app/_components/charts/performance-overview-chart").then(module => ({ default: module.PerformanceOverviewChart }))
);
const FeeAnalysisChart = lazy(() =>
  import("@/app/_components/charts/fee-analysis-chart").then(module => ({ default: module.FeeAnalysisChart }))
);

// Lazy load the trade history table component
const TradeHistoryTable = lazy(() =>
  import("@/app/_components/trade-history-table").then(module => ({ default: module.TradeHistoryTable }))
);

export function LazyPerformanceOverview() {
  return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <EnhancedCardTitle>Performance Overview</EnhancedCardTitle>
        <EnhancedCardDescription>
          Key performance indicators and metrics
        </EnhancedCardDescription>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <PerformanceOverviewChart />
        </Suspense>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

export function LazyFeeAnalysis() {
 return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <EnhancedCardTitle>Fee Analysis</EnhancedCardTitle>
        <EnhancedCardDescription>
          Trading fees breakdown and optimization
        </EnhancedCardDescription>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <Suspense fallback={<Skeleton className="h-80 w-full" />}>
          <FeeAnalysisChart />
        </Suspense>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}

export function LazyTradeHistoryTable({ limit }: { limit?: number }) {
  return (
    <Suspense fallback={
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Recent Trades</EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading trades...</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    }>
      <TradeHistoryTable limit={limit} />
    </Suspense>
  );
}