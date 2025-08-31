"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FeeInputProps {
  fees: number;
  quantity: number;
  price: number;
  onFeesChange: (fees: number) => void;
  initialFeeInputType?: "fixed" | "percentage";
}

export function FeeInput({
  fees,
  quantity,
  price,
  onFeesChange,
  initialFeeInputType = "fixed"
}: FeeInputProps) {
  const [feeInputType, setFeeInputType] = useState<"fixed" | "percentage">(initialFeeInputType);
  const [feePercentage, setFeePercentage] = useState<number>(0);
  const [feePercentageInput, setFeePercentageInput] = useState<string>(""); // To store the raw input string
  const [feeFixedInput, setFeeFixedInput] = useState<string>(""); // To store the raw input string

const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (feeInputType === "percentage") {
      // Store the raw input string to preserve decimal points during typing
      setFeePercentageInput(value);
      
      // Parse the value for calculations
      const percentage = value === "" ? 0 : parseFloat(value) || 0;
      setFeePercentage(percentage);
      
      // Calculate the actual fee value as a percentage of total trade value (quantity * price)
      const feeValue = (quantity * price * percentage) / 100;
      
      // Round to 2 decimal places to prevent floating point precision issues
      onFeesChange(Math.round(feeValue * 100) / 100);
    } else {
      // Store the raw input string to preserve decimal points during typing
      setFeeFixedInput(value);
      
      // Parse the value for calculations
      const feeValue = value === "" ? 0 : parseFloat(value) || 0;
      // Round to 2 decimal places to prevent floating point precision issues
      onFeesChange(Math.round(feeValue * 100) / 100);
    }
  };

  const handleToggleFeeInputType = (type: "fixed" | "percentage") => {
      setFeeInputType(type);
      
      if (type === "percentage") {
        // Convert existing fee to percentage of total trade value
        if (quantity > 0 && price > 0) {
          const percentage = (fees / (quantity * price)) * 100;
          setFeePercentage(parseFloat(percentage.toFixed(2)));
        }
      } else {
        // Reset the fixed input when switching to fixed mode
        setFeeFixedInput("");
        setFeePercentageInput("");
      }
   };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="fees">Fees</Label>
        <div className="flex space-x-2">
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs ${feeInputType === "fixed" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => handleToggleFeeInputType("fixed")}
          >
            Fixed
          </button>
          <button
            type="button"
            className={`rounded px-2 py-1 text-xs ${feeInputType === "percentage" ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            onClick={() => handleToggleFeeInputType("percentage")}
          >
            %
          </button>
        </div>
      </div>
      <Input
        type="number"
        id="fees"
        name="fees"
        value={
          feeInputType === "percentage"
            ? feePercentageInput || feePercentage || ""
            : feeFixedInput || fees || ""
        }
        onChange={handleFeesChange}
        min="0"
        step={feeInputType === "percentage" ? "0.01" : "0.01"}
        placeholder={feeInputType === "percentage" ? "0.00%" : "0.0"}
      />
      {feeInputType === "percentage" && (
              <p className="text-xs text-muted-foreground">
                {feePercentage.toFixed(2)}% = {fees.toFixed(2)} USD (calculated)
              </p>
            )}
    </div>
  );
}