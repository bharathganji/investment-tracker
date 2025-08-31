"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateSideSectionProps {
  date: Date | string;
  side: "buy" | "sell";
  onDateChange: (date: Date) => void;
  onSideChange: (side: "buy" | "sell") => void;
}

export function DateSideSection({ 
  date, 
  side, 
  onDateChange, 
  onSideChange 
}: DateSideSectionProps) {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDateChange(new Date(e.target.value));
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="date">Date & Time</Label>
        <Input
          type="datetime-local"
          id="date"
          name="date"
          value={
            date instanceof Date
              ? date.toISOString().slice(0, 16)
              : typeof date === "string"
              ? new Date(date).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16)
          }
          onChange={handleDateChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="side">Side</Label>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 transition-colors ${
              side === "buy"
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => onSideChange("buy")}
          >
            Buy
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-4 py-2 transition-colors ${
              side === "sell"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => onSideChange("sell")}
          >
            Sell
          </button>
        </div>
      </div>
    </div>
  );
}