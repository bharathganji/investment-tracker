import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
} from "@/components/ui/enhanced-card";
import { LazyTradeHistoryTable } from "./lazy-charts";

export function RecentTrades() {
  return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <EnhancedCardTitle>Recent Trades</EnhancedCardTitle>
        <EnhancedCardDescription>Your most recent trading activity</EnhancedCardDescription>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        <LazyTradeHistoryTable limit={10} />
      </EnhancedCardContent>
    </EnhancedCard>
  );
}