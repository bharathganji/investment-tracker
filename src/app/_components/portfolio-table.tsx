"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadTrades } from '@/store/trades/tradesThunks';
import { calculatePortfolioHoldings } from '@/store/portfolio/portfolioThunks';
import { type CalculatedPortfolioHolding } from "@/types/portfolio";
import {
  EnhancedTable,
  EnhancedTableBody,
  EnhancedTableCell,
  EnhancedTableHead,
  EnhancedTableHeader,
  EnhancedTableRow,
} from "@/components/ui/enhanced-table";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { Badge } from "@/components/ui/badge";
import { financialColors } from "@/lib/utils";
import { motion } from "framer-motion";

interface PortfolioTableProps {
  onRefresh?: () => void;
}

export function PortfolioTable({ onRefresh }: PortfolioTableProps) {
  const dispatch = useAppDispatch();
  const trades = useAppSelector((state) => state.trades.trades);
  const holdings = useAppSelector((state) => state.portfolio.holdings);
  const portfolioLoading = useAppSelector((state) => state.portfolio.loading);
  const tradesLoading = useAppSelector((state) => state.trades.loading);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadHoldings();
  }, []);

  useEffect(() => {
    // Update loading state when portfolio data changes
    setLoading(portfolioLoading || tradesLoading);
  }, [portfolioLoading, tradesLoading]);

  const loadHoldings = async () => {
    try {
      setLoading(true);
      // Load trades first
      const result = await dispatch(loadTrades()).unwrap();
      
      // Convert serializable trades back to Trade objects with Date instances
      const tradesWithDates = result.map(trade => ({
        ...trade,
        date: new Date(trade.date)
      }));
      
      // Calculate portfolio holdings based on trades
      await dispatch(calculatePortfolioHoldings(tradesWithDates)).unwrap();
    } catch (error) {
      console.error("Error loading holdings:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    void loadHoldings();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <EnhancedCard>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Portfolio Holdings</EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading holdings...</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <EnhancedCard>
        <EnhancedCardHeader>
          <div className="flex items-center justify-between">
            <EnhancedCardTitle>Portfolio Holdings</EnhancedCardTitle>
            <Badge variant="secondary">{holdings.length} assets</Badge>
          </div>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          {holdings.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                No holdings in your portfolio yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <EnhancedTable>
                <EnhancedTableHeader>
                  <EnhancedTableRow>
                    <EnhancedTableHead className="whitespace-nowrap">Asset</EnhancedTableHead>
                    <EnhancedTableHead className="whitespace-nowrap">Quantity</EnhancedTableHead>
                    <EnhancedTableHead className="whitespace-nowrap">Avg Cost</EnhancedTableHead>
                    <EnhancedTableHead className="whitespace-nowrap">Current Value</EnhancedTableHead>
                    <EnhancedTableHead className="whitespace-nowrap">P&L</EnhancedTableHead>
                    <EnhancedTableHead className="whitespace-nowrap">P&L %</EnhancedTableHead>
                  </EnhancedTableRow>
                </EnhancedTableHeader>
                <EnhancedTableBody>
                  {holdings.map((holding) => (
                    <EnhancedTableRow
                      key={holding.asset}
                      variant={holding.unrealizedPnL >= 0 ? "positive" : "negative"}
                    >
                      <EnhancedTableCell className="font-medium whitespace-nowrap">{holding.asset}</EnhancedTableCell>
                      <EnhancedTableCell className="whitespace-nowrap">{holding.quantity.toLocaleString()}</EnhancedTableCell>
                      <EnhancedTableCell className="whitespace-nowrap">${holding.averageCost.toFixed(2)}</EnhancedTableCell>
                      <EnhancedTableCell className="font-medium whitespace-nowrap">
                        ${holding.currentValue.toFixed(2)}
                      </EnhancedTableCell>
                      <EnhancedTableCell
                        variant={holding.unrealizedPnL >= 0 ? "positive" : "negative"}
                        align="right"
                        className="whitespace-nowrap"
                      >
                        ${holding.unrealizedPnL.toFixed(2)}
                      </EnhancedTableCell>
                      <EnhancedTableCell
                        variant={holding.unrealizedPnLPercentage >= 0 ? "positive" : "negative"}
                        align="right"
                        className="whitespace-nowrap"
                      >
                        {holding.unrealizedPnLPercentage.toFixed(2)}%
                      </EnhancedTableCell>
                    </EnhancedTableRow>
                  ))}
                </EnhancedTableBody>
              </EnhancedTable>
            </div>
          )}
        </EnhancedCardContent>
      </EnhancedCard>
    </motion.div>
  );
}
