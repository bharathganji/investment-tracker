"use client";

import { BaseTradeForm } from "./trade-form-components/base-trade-form";
import { type TradeFormData } from "@/types";

interface TradeFormProps {
  initialData?: Partial<TradeFormData>;
  onSubmit?: (trade: TradeFormData) => void;
  onCancel?: () => void;
}

export function TradeForm({ initialData, onSubmit, onCancel }: TradeFormProps) {
  return (
    <BaseTradeForm
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={onCancel}
      title="Trade Entry Form"
      description="Record a new trade with details and fees"
    />
  );
}
