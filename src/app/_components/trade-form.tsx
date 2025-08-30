"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type TradeFormData } from "@/types";
import { saveTrade } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface TradeFormProps {
  initialData?: Partial<TradeFormData>;
  onSubmit?: (trade: TradeFormData) => void;
  onCancel?: () => void;
}

export function TradeForm({ initialData, onSubmit, onCancel }: TradeFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TradeFormData>({
    date: initialData?.date ?? new Date(),
    asset: initialData?.asset ?? "",
    side: initialData?.side ?? "buy",
    quantity: initialData?.quantity ?? 0,
    price: initialData?.price ?? 0,
    fees: initialData?.fees ?? 0,
    tradeType: initialData?.tradeType ?? "maker",
    notes: initialData?.notes ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "price" || name === "fees"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Basic validation
      if (!formData.asset.trim()) {
        throw new Error("Asset is required");
      }
      if (formData.quantity <= 0) {
        throw new Error("Quantity must be greater than 0");
      }
      if (formData.price <= 0) {
        throw new Error("Price must be greater than 0");
      }

      if (onSubmit) {
        onSubmit(formData);
      } else {
        // Save trade and redirect
        saveTrade(formData);
        router.push("/trade-history");
        router.refresh();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while saving the trade",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trade Entry Form</CardTitle>
        <CardDescription>
          Record a new trade with details and auto-calculated fees
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date & Time</Label>
              <Input
                type="datetime-local"
                id="date"
                name="date"
                value={formData.date.toISOString().slice(0, 16)}
                onChange={handleChange}
                required
              />
            </div>

            {/* Asset */}
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Input
                type="text"
                id="asset"
                name="asset"
                value={formData.asset}
                onChange={handleChange}
                placeholder="e.g., AAPL, BTC, ETH"
                required
              />
            </div>

            {/* Side */}
            <div className="space-y-2">
              <Label htmlFor="side">Side</Label>
              <Select
                name="side"
                value={formData.side}
                onValueChange={(value) => handleSelectChange("side", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity ?? ""}
                onChange={handleChange}
                min="0"
                step="0.0001"
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price ?? ""}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Fees */}
            <div className="space-y-2">
              <Label htmlFor="fees">Fees</Label>
              <Input
                type="number"
                id="fees"
                name="fees"
                value={formData.fees || ""}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            {/* Trade Type */}
            <div className="space-y-2">
              <Label htmlFor="tradeType">Trade Type</Label>
              <Select
                name="tradeType"
                value={formData.tradeType}
                onValueChange={(value) =>
                  handleSelectChange("tradeType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maker">Maker</SelectItem>
                  <SelectItem value="taker">Taker</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes about this trade..."
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel ?? (() => router.back())}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Trade"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
