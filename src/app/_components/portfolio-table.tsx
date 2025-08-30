"use client";

import { useState, useEffect } from "react";
import { getPortfolioHoldings } from "@/lib/data-store";
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
  const [holdings, setHoldings] = useState<CalculatedPortfolioHolding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHoldings();
  }, []);

  const loadHoldings = () => {
    try {
      const holdingData = getPortfolioHoldings();
      setHoldings(holdingData);
    } catch (error) {
      console.error("Error loading holdings:", error);
    } finally {
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
            <EnhancedTable>
              <EnhancedTableHeader>
                <EnhancedTableRow>
                  <EnhancedTableHead>Asset</EnhancedTableHead>
                  <EnhancedTableHead>Quantity</EnhancedTableHead>
                  <EnhancedTableHead>Average Cost</EnhancedTableHead>
                  <EnhancedTableHead>Current Value</EnhancedTableHead>
                  <EnhancedTableHead>P&L</EnhancedTableHead>
                  <EnhancedTableHead>P&L %</EnhancedTableHead>
                </EnhancedTableRow>
              </EnhancedTableHeader>
              <EnhancedTableBody>
                {holdings.map((holding) => (
                  <EnhancedTableRow
                    key={holding.asset}
                    variant={holding.unrealizedPnL >= 0 ? "positive" : "negative"}
                  >
                    <EnhancedTableCell className="font-medium">{holding.asset}</EnhancedTableCell>
                    <EnhancedTableCell>{holding.quantity.toLocaleString()}</EnhancedTableCell>
                    <EnhancedTableCell>${holding.averageCost.toFixed(2)}</EnhancedTableCell>
                    <EnhancedTableCell className="font-medium">
                      ${holding.currentValue.toFixed(2)}
                    </EnhancedTableCell>
                    <EnhancedTableCell
                      variant={holding.unrealizedPnL >= 0 ? "positive" : "negative"}
                      align="right"
                    >
                      ${holding.unrealizedPnL.toFixed(2)}
                    </EnhancedTableCell>
                    <EnhancedTableCell
                      variant={holding.unrealizedPnLPercentage >= 0 ? "positive" : "negative"}
                      align="right"
                    >
                      {holding.unrealizedPnLPercentage.toFixed(2)}%
                    </EnhancedTableCell>
                  </EnhancedTableRow>
                ))}
              </EnhancedTableBody>
            </EnhancedTable>
          )}
        </EnhancedCardContent>
      </EnhancedCard>
    </motion.div>
  );
}
