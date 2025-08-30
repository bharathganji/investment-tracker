"use client";

import { useState, useEffect } from 'react';
import { getTrades } from '@/lib/data-store';
import { type Trade } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TradeHistoryTableProps {
  limit?: number;
  onTradeClick?: (trade: Trade) => void;
  onRefresh?: () => void;
}

export function TradeHistoryTable({ limit, onTradeClick, onRefresh }: TradeHistoryTableProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrades();
  }, []);

  const loadTrades = () => {
    try {
      const tradeData = getTrades();
      const sortedTrades = tradeData.sort((a, b) => b.date.getTime() - a.date.getTime());
      setTrades(limit ? sortedTrades.slice(0, limit) : sortedTrades);
    } catch (error) {
      console.error('Error loading trades:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    loadTrades();
    if (onRefresh) {
      onRefresh();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading trades...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{limit ? 'Recent Trades' : 'Trade History'}</CardTitle>
          {!limit && <Badge variant="secondary">{trades.length} trades</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {trades.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No trades recorded yet.</p>
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
              {trades.map((trade) => (
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
