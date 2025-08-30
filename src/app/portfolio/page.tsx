"use client";

import { PortfolioTable } from "@/app/_components/portfolio-table";
import { PortfolioChart } from "@/app/_components/charts/portfolio-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPortfolioHoldings } from "@/lib/data-store";
import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const [totalValue, setTotalValue] = useState(0);
  const [holdingsCount, setHoldingsCount] = useState(0);

  const loadPortfolioStats = () => {
    try {
      const holdingData = getPortfolioHoldings();
      const total = holdingData.reduce(
        (sum, holding) => sum + holding.currentValue,
        0,
      );
      setTotalValue(total);
      setHoldingsCount(holdingData.length);
    } catch (error) {
      console.error("Error loading portfolio stats:", error);
    }
  };

  useEffect(() => {
    loadPortfolioStats();
  }, []);

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your investments and monitor performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>
              Track your investments and monitor performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Portfolio Value
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground text-right">
                    Assets
                  </p>
                  <p className="text-2xl font-bold text-right">
                    {holdingsCount}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button asChild>
                  <a href="/trade-entry">Add New Trade</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>
              Distribution of your investments
            </CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <PortfolioChart />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>
            Detailed view of your portfolio holdings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioTable onRefresh={loadPortfolioStats} />
        </CardContent>
      </Card>
    </section>
  );
}
