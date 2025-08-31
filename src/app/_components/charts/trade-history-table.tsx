"use client";

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadTrades } from '@/store/trades/tradesThunks';
import { Trade } from '@/types';
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

interface TradeHistoryTableProps {
  limit?: number;
  onTradeClick?: (trade: Trade) => void;
  onRefresh?: () => void;
}

export function TradeHistoryTable({ limit, onTradeClick, onRefresh }: TradeHistoryTableProps) {
  const dispatch = useAppDispatch();
  const tradesState = useAppSelector((state) => state.trades);
  const trades = tradesState && 'trades' in tradesState ? tradesState.trades : [];
  const tradesLoading = tradesState && 'loading' in tradesState ? tradesState.loading : false;
  
  const [displayTrades, setDisplayTrades] = useState<Trade[]>([]);

  useEffect(() => {
    loadTradesData();
  }, []);

  useEffect(() => {
    // Update display trades when the trades data changes
    // Convert serializable trades back to Trade objects with Date instances
    const tradesWithDates = trades.map(trade => ({
      ...trade,
      date: new Date(trade.date)
    }));
    const sortedTrades = [...tradesWithDates].sort((a, b) => b.date.getTime() - a.date.getTime());
    setDisplayTrades(limit ? sortedTrades.slice(0, limit) : sortedTrades);
  }, [trades, limit]);

  const loadTradesData = () => {
    void dispatch(loadTrades());
  };

  const refreshData = () => {
    loadTradesData();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (tradesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
          <CardDescription>Loading trades...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading trades...</p>
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
            <CardTitle>{limit ? 'Recent Trades' : 'Trade History'}</CardTitle>
            <CardDescription>
              {displayTrades.length} {displayTrades.length === 1 ? 'trade' : 'trades'}
            </CardDescription>
          </div>
          {displayTrades.length === 0 && !limit && (
            <Button asChild>
              <a href="/trade-entry">Add Your First Trade</a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayTrades.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No trades recorded yet.</p>
            <Button asChild>
              <a href="/trade-entry">Add Your First Trade</a>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>Side</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Total</TableHead>
                {onTradeClick && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">
                    {trade.date.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{trade.asset}</TableCell>
                  <TableCell>
                    <Badge variant={trade.side === 'buy' ? 'default' : 'destructive'}>
                      {trade.side.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{trade.quantity.toLocaleString()}</TableCell>
                  <TableCell>${trade.price.toFixed(2)}</TableCell>
                  <TableCell>${trade.fees.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    ${(trade.quantity * trade.price + trade.fees).toFixed(2)}
                  </TableCell>
                  {onTradeClick && (
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => onTradeClick(trade)}>
                        View
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
