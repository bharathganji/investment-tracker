"use client";

import { BaseTradeForm } from "./trade-form-components/base-trade-form";
import { type TradeFormData } from "@/types";

interface TradeEntryFormProps {
  initialData?: Partial<TradeFormData>;
  existingTrade?: TradeFormData & { id: string };
  onSubmit?: (trade: TradeFormData) => void;
  onCancel?: () => void;
}

export function TradeEntryForm({
  initialData,
  existingTrade,
  onSubmit,
  onCancel,
}: TradeEntryFormProps) {
  return (
    <BaseTradeForm
      initialData={initialData}
      existingTrade={existingTrade}
      onSubmit={onSubmit}
      onCancel={onCancel}
      title={existingTrade ? "Edit Trade" : "Add New Trade"}
      description={
        existingTrade
          ? "Edit the details of your existing trade"
          : "Record a new trade with details and fees"
      }
    />
  );
}
