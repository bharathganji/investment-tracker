"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadTrades, deleteTrade } from '@/store/trades/tradesThunks';
import { type Trade } from '@/types';
import { TradeEntryForm } from '@/app/_components/trade-entry-form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface TradeHistoryTableProps {
  limit?: number;
  onTradeClick?: (trade: Trade) => void;
  onRefresh?: () => void;
}

export function TradeHistoryTable({ limit, onTradeClick, onRefresh }: TradeHistoryTableProps) {
  const dispatch = useAppDispatch();
  const trades = useAppSelector((state) => state.trades.trades);
  const tradesLoading = useAppSelector((state) => state.trades.loading);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState<Trade | null>(null);
  const [displayTrades, setDisplayTrades] = useState<Trade[]>([]);

  // Stable functions for dialog onOpenChange handlers
  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setTradeToDelete(null);
    }
  }, []);

  const handleEditDialogOpenChange = useCallback((open: boolean) => {
    setIsEditDialogOpen(open);
    if (!open) {
      setTradeToEdit(null);
    }
  }, []);

  // Load trades data on component mount
  useEffect(() => {
    void loadTradesData();
  }, []); // Only run once on mount

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

  const loadTradesData = useCallback(async () => {
    if (tradesLoading) return; // Prevent multiple simultaneous loads
    try {
      await dispatch(loadTrades()).unwrap();
    } catch (error) {
      console.error("Error loading trades:", error);
    }
  }, [dispatch, tradesLoading]);

  const refreshData = () => {
    void loadTradesData();
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleDeleteClick = (trade: Trade) => {
    setTradeToDelete(trade);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (tradeToDelete) {
      try {
        await dispatch(deleteTrade(tradeToDelete.id)).unwrap();
        toast.success("Trade deleted successfully!", {
          description: `Deleted ${tradeToDelete.side} trade for ${tradeToDelete.asset}`,
        });
        refreshData();
      } catch (error) {
        toast.error("Failed to delete trade", {
          description: "Trade not found",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        // setTradeToDelete(null) is now handled in onOpenChange callback
      }
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    // setTradeToDelete(null) is now handled in onOpenChange callback
  };

  const handleEditClick = (trade: Trade) => {
    setTradeToEdit(trade);
    setIsEditDialogOpen(true);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    // setTradeToEdit(null) is now handled in onOpenChange callback
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    // setTradeToEdit(null) is now handled in onOpenChange callback
    refreshData();
  };

  if (tradesLoading) {
    return (
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Trade History</EnhancedCardTitle>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading trades...</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <div className="flex items-center justify-between">
          <EnhancedCardTitle>{limit ? 'Recent Trades' : 'Trade History'}</EnhancedCardTitle>
          {!limit && <Badge variant="secondary">{displayTrades.length} trades</Badge>}
        </div>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        {displayTrades.length === 0 ? (
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
                <TableHead>Actions</TableHead>
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
                  <TableCell>${trade.price.toFixed(4)}</TableCell>
                  <TableCell>${trade.fees.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    ${(trade.quantity * trade.price + trade.fees).toFixed(2)}
                  </TableCell>
                  <TableCell className="flex space-x-2">
                    {onTradeClick && (
                      <Button variant="outline" size="sm" onClick={() => onTradeClick(trade)}>
                        View
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(trade)}>
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(trade)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Dialog open={isDeleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this trade? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {tradeToDelete && (
              <div className="py-4">
                <p className="font-medium">{tradeToDelete.asset}</p>
                <p className="text-sm text-muted-foreground">
                  {tradeToDelete.side.toUpperCase()} - {tradeToDelete.quantity} @ ${tradeToDelete.price.toFixed(4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tradeToDelete.date.toLocaleDateString()}
                </p>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={handleDeleteCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={handleEditDialogOpenChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Trade</DialogTitle>
            </DialogHeader>
            {tradeToEdit && (
              <TradeEntryForm
                existingTrade={tradeToEdit}
                onCancel={handleEditCancel}
                onSubmit={handleEditSuccess}
              />
            )}
          </DialogContent>
        </Dialog>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
