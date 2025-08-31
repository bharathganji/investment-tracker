"use client";

import { TradeHistoryTable } from "@/app/_components/trade-history-table";
import { Button } from "@/components/ui/button";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";

export default function TradeHistoryPage() {
  const tradesState = useAppSelector((state) => state.trades);
  const trades =
    tradesState && "trades" in tradesState ? tradesState.trades : [];

  const [tradesCount, setTradesCount] = useState(0);

  const loadTradesStats = () => {
    try {
      setTradesCount(trades.length);
    } catch (error) {
      console.error("Error loading trades stats:", error);
    }
  };

  useEffect(() => {
    loadTradesStats();
  }, [trades, loadTradesStats]);

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Trade History</h1>
        <p className="text-muted-foreground">
          Review and manage your complete trading activity
        </p>
      </div>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <EnhancedCardTitle>Trade History</EnhancedCardTitle>
              <EnhancedCardDescription>
                Complete record of all your trades
              </EnhancedCardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-right text-sm text-muted-foreground">
                  Total Trades
                </p>
                <p className="text-right text-2xl font-bold">{tradesCount}</p>
              </div>
              <Button asChild>
                <a href="/trade-entry">Add New Trade</a>
              </Button>
            </div>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <TradeHistoryTable onRefresh={loadTradesStats} />
        </EnhancedCardContent>
      </EnhancedCard>
    </section>
  );
}
