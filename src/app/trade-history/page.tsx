"use client";

import { TradeHistoryTable } from "@/app/_components/trade-history-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTrades } from "@/lib/data-store";
import { useState, useEffect } from "react";

export default function TradeHistoryPage() {
  const [tradesCount, setTradesCount] = useState(0);

  const loadTradesStats = () => {
    try {
      const tradeData = getTrades();
      setTradesCount(tradeData.length);
    } catch (error) {
      console.error("Error loading trades stats:", error);
    }
  };

  useEffect(() => {
    loadTradesStats();
  }, []);

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Trade History</h1>
        <p className="text-muted-foreground">
          Review and manage your complete trading activity
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Trade History</CardTitle>
              <CardDescription>
                Complete record of all your trades
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground text-right">
                  Total Trades
                </p>
                <p className="text-2xl font-bold text-right">
                  {tradesCount}
                </p>
              </div>
              <Button asChild>
                <a href="/trade-entry">Add New Trade</a>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TradeHistoryTable onRefresh={loadTradesStats} />
        </CardContent>
      </Card>
    </section>
  );
}
