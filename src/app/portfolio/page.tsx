"use client";

import { PortfolioTable } from "@/app/_components/portfolio-table";
import { PortfolioChart } from "@/app/_components/charts/portfolio-chart";
import { PortfolioAllocationChart } from "@/app/_components/charts/portfolio-allocation-chart";
import { Button } from "@/components/ui/button";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { loadTrades } from '@/store/trades/tradesThunks';
import { calculatePortfolioHoldings } from '@/store/portfolio/portfolioThunks';
import { useState, useEffect } from "react";

export default function PortfolioPage() {
  const dispatch = useAppDispatch();
  const portfolioState = useAppSelector((state) => state.portfolio);
  const tradesState = useAppSelector((state) => state.trades);
  const holdings = portfolioState && 'holdings' in portfolioState ? portfolioState.holdings : [];
  
  const [totalValue, setTotalValue] = useState(0);
  const [holdingsCount, setHoldingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPortfolioStats = () => {
    try {
      const total = holdings.reduce(
        (sum, holding) => sum + holding.currentValue,
        0,
      );
      setTotalValue(total);
      setHoldingsCount(holdings.length);
    } catch (error) {
      console.error("Error loading portfolio stats:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Load trades from localStorage
        const tradesResult = await dispatch(loadTrades());
        
        if (loadTrades.fulfilled.match(tradesResult)) {
          // Convert serializable trades back to Trade objects with Date instances
          const tradesWithDates = tradesResult.payload.map(trade => ({
            ...trade,
            date: new Date(trade.date)
          }));
          
          // Calculate portfolio holdings based on trades
          await dispatch(calculatePortfolioHoldings(tradesWithDates));
        }
      } catch (error) {
        console.error("Error loading portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    void loadData();
  }, [dispatch]);

  useEffect(() => {
    loadPortfolioStats();
  }, [holdings]);

  if (loading) {
    return (
      <section className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Portfolio</h1>
          <p className="text-muted-foreground">
            Track your investments and monitor performance
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <EnhancedCard className="rounded-xl" animateOnHover>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Portfolio Overview</EnhancedCardTitle>
              <EnhancedCardDescription>
                Track your investments and monitor performance
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Portfolio Value
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      Loading...
                    </p>
                  </div>
                  <div className="text-right md:text-left">
                    <p className="text-sm text-muted-foreground">
                      Assets
                    </p>
                    <p className="text-2xl font-bold">
                      Loading...
                    </p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button asChild>
                    <a href="/trade-entry">Add New Trade</a>
                  </Button>
                </div>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
          
          <EnhancedCard className="rounded-xl" animateOnHover>
            <EnhancedCardHeader>
              <EnhancedCardTitle>Portfolio Allocation</EnhancedCardTitle>
              <EnhancedCardDescription>
                Distribution of your investments
              </EnhancedCardDescription>
            </EnhancedCardHeader>
            <EnhancedCardContent className="h-64">
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading allocation data...</p>
              </div>
            </EnhancedCardContent>
          </EnhancedCard>
        </div>
        
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Holdings</EnhancedCardTitle>
            <EnhancedCardDescription>
              Detailed view of your portfolio holdings
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Loading holdings...</p>
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Portfolio</h1>
        <p className="text-muted-foreground">
          Track your investments and monitor performance
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Portfolio Overview</EnhancedCardTitle>
            <EnhancedCardDescription>
              Track your investments and monitor performance
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Portfolio Value
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
                <div className="text-right md:text-left">
                  <p className="text-sm text-muted-foreground">
                    Assets
                  </p>
                  <p className="text-2xl font-bold">
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
          </EnhancedCardContent>
        </EnhancedCard>

        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Portfolio Allocation</EnhancedCardTitle>
            <EnhancedCardDescription>
              Distribution of your investments
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent className="h-64">
            <PortfolioAllocationChart standalone={false} />
          </EnhancedCardContent>
        </EnhancedCard>
      </div>

      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Holdings</EnhancedCardTitle>
          <EnhancedCardDescription>
            Detailed view of your portfolio holdings
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <PortfolioTable onRefresh={loadPortfolioStats} />
        </EnhancedCardContent>
      </EnhancedCard>
    </section>
  );
}
