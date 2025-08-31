"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadTrades } from "@/store/trades/tradesThunks";
import { calculatePortfolioHoldings } from "@/store/portfolio/portfolioThunks";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PortfolioTableProps {
  onRefresh?: () => void;
}

export function PortfolioTable({ onRefresh }: PortfolioTableProps) {
  const dispatch = useAppDispatch();
  const tradesState = useAppSelector((state) => state.trades);
  const portfolioState = useAppSelector((state) => state.portfolio);

  const trades =
    tradesState && "trades" in tradesState ? tradesState.trades : [];
  const holdings =
    portfolioState && "holdings" in portfolioState
      ? portfolioState.holdings
      : [];
  const portfolioLoading =
    portfolioState && "loading" in portfolioState
      ? portfolioState.loading
      : false;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHoldings();
  }, []);

  useEffect(() => {
    // Update loading state when portfolio data changes
    setLoading(portfolioLoading);
  }, [portfolioLoading]);

  const loadHoldings = () => {
    try {
      void dispatch(loadTrades()).then((result) => {
        if (loadTrades.fulfilled.match(result)) {
          // Convert serializable trades to Trade objects with Date instances
          const tradesWithDates = result.payload.map((trade) => ({
            ...trade,
            date: new Date(trade.date),
          }));

          // Calculate portfolio holdings based on trades
          void dispatch(calculatePortfolioHoldings(tradesWithDates));
        }
      });
    } catch (error) {
      console.error("Error loading holdings:", error);
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadHoldings();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
          <CardDescription>Loading portfolio...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading holdings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              {holdings.length} {holdings.length === 1 ? "asset" : "assets"}
            </CardDescription>
          </div>
          {holdings.length === 0 && (
            <Button asChild>
              <a href="/trade-entry">Add Your First Trade</a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {holdings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="mb-4 text-lg text-muted-foreground">
              No holdings in your portfolio yet.
            </p>
            <Button asChild>
              <a href="/trade-entry">Add Your First Trade</a>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Average Cost</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead>P&L</TableHead>
                <TableHead>P&L %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => (
                <TableRow key={holding.asset}>
                  <TableCell className="font-medium">{holding.asset}</TableCell>
                  <TableCell>{holding.quantity.toLocaleString()}</TableCell>
                  <TableCell>${holding.averageCost.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    ${holding.currentValue.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        holding.unrealizedPnL >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      ${holding.unrealizedPnL.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        holding.unrealizedPnLPercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {holding.unrealizedPnLPercentage.toFixed(2)}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
