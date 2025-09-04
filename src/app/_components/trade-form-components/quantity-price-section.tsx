"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface QuantityPriceSectionProps {
  quantity: number;
  price: number;
  onQuantityChange: (quantity: number) => void;
  onPriceChange: (price: number) => void;
}

export function QuantityPriceSection({
  quantity,
  price,
  onQuantityChange,
  onPriceChange,
}: QuantityPriceSectionProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuantityChange(parseFloat(e.target.value) || 0);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceChange(parseFloat(e.target.value) || 0);
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          type="number"
          id="quantity"
          name="quantity"
          value={quantity ?? ""}
          onChange={handleQuantityChange}
          min="0"
          step="0.0001"
          required
          className="text-base md:text-sm"
          inputMode="decimal"
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          type="number"
          id="price"
          name="price"
          value={price ?? ""}
          onChange={handlePriceChange}
          min="0"
          step="0.0001"
          required
          className="text-base md:text-sm"
          inputMode="decimal"
          autoComplete="off"
        />
      </div>
    </div>
  );
}
