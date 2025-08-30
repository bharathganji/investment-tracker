"use client";

import { useState, useEffect } from 'react';
import { getPortfolioHoldings } from '@/lib/data-store';
import { CalculatedPortfolioHolding } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      console.error('Error loading holdings:', error);
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
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Holdings</CardTitle>
          <CardDescription>Loading portfolio...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading holdings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Portfolio Holdings</CardTitle>
            <CardDescription>
              {holdings.length} {holdings.length === 1 ? 'asset' : 'assets'}
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
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No holdings in your portfolio yet.</p>
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
                  <TableCell className="font-medium">${holding.currentValue.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={holding.unrealizedPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ${holding.unrealizedPnL.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={holding.unrealizedPnLPercentage >= 0 ? 'text-green-600' : 'text-red-600'}>
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
