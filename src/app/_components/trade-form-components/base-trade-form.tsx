"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  saveTrade,
  updateTrade,
  loadTrades,
} from "@/store/trades/tradesThunks";
import { type TradeFormData } from "@/types";
import { getSettings } from "@/lib/settings";
import { getUniqueAssets } from "@/lib/asset-utils";
import { useTradeValidation } from "./use-trade-validation";
import { AssetInput } from "./asset-input";
import { DateSideSection } from "./date-side-section";
import { QuantityPriceSection } from "./quantity-price-section";
import { FeeInput } from "./fee-input";
import { NotesSection } from "./notes-section";
import { Button } from "@/components/ui/button";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface BaseTradeFormProps {
  initialData?: Partial<TradeFormData>;
  existingTrade?: TradeFormData & { id: string };
  onSubmit?: (trade: TradeFormData) => void;
  onCancel?: () => void;
  title: string;
  description: string;
}

export function BaseTradeForm({
  initialData,
  existingTrade,
  onSubmit,
  onCancel,
  title,
  description,
}: BaseTradeFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const tradesState = useAppSelector((state) => state.trades);
  const trades =
    tradesState && "trades" in tradesState ? tradesState.trades : [];

  const [formData, setFormData] = useState<TradeFormData>(
    existingTrade
      ? {
          date: existingTrade.date,
          asset: existingTrade.asset,
          side: existingTrade.side,
          quantity: existingTrade.quantity,
          price: existingTrade.price,
          fees: existingTrade.fees,
          notes: existingTrade.notes ?? "",
        }
      : {
          date: initialData?.date ?? new Date(),
          asset: initialData?.asset ?? "",
          side: initialData?.side ?? "buy",
          quantity: initialData?.quantity ?? 0,
          price: initialData?.price ?? 0,
          fees: initialData?.fees ?? 0,
          notes: initialData?.notes ?? "",
        },
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allAssets, setAllAssets] = useState<string[]>([]);
  const [feeInputMethod, setFeeInputMethod] = useState<"fixed" | "percentage">(
    "fixed",
  );
  const assetInputRef = useRef<HTMLInputElement>(null);
  const { validateTradeForm } = useTradeValidation();

  // Load trades when component mounts
  useEffect(() => {
    void dispatch(loadTrades());
  }, [dispatch]);

  // Load global setting for fee input method and assets
  useEffect(() => {
    // Only apply global setting for new trades, not when editing existing trades
    if (!existingTrade) {
      const settings = getSettings();
      setFeeInputMethod(settings.feeInputMethod);
    }

    // Load unique assets from trade history
    const assets = getUniqueAssets(trades);
    setAllAssets(assets);
  }, [trades, existingTrade]);

  const handleAssetChange = (asset: string) => {
    setFormData((prev) => ({
      ...prev,
      asset,
    }));
  };

  const handleAssetSelect = (asset: string) => {
    setFormData((prev) => ({
      ...prev,
      asset,
    }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({
      ...prev,
      date,
    }));
  };

  const handleSideChange = (side: "buy" | "sell") => {
    setFormData((prev) => ({
      ...prev,
      side,
    }));
  };

  const handleQuantityChange = (quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      quantity,
    }));
  };

  const handlePriceChange = (price: number) => {
    setFormData((prev) => ({
      ...prev,
      price,
    }));
  };

  const handleFeesChange = (fees: number) => {
    console.log("handleFeesChange called with:", fees);
    setFormData((prev) => ({
      ...prev,
      fees,
    }));
    console.log("formData after fees change:", { ...formData, fees });
  };

  const handleNotesChange = (notes: string) => {
    setFormData((prev) => ({
      ...prev,
      notes,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Form submitted");
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate form
      const errors = validateTradeForm({
        asset: formData.asset,
        quantity: formData.quantity,
        price: formData.price,
      });

      console.log("Validation errors:", errors);
      if (Object.keys(errors).length > 0) {
        const errorMessages = Object.values(errors).filter(Boolean) as string[];
        throw new Error(errorMessages.join(", "));
      }

      console.log(
        "Checking conditions: onSubmit =",
        onSubmit,
        "existingTrade =",
        existingTrade,
      );
      if (existingTrade) {
        // Update existing trade
        console.log("Updating trade with formData:", formData);
        void dispatch(
          updateTrade({ id: existingTrade.id, updatedTrade: formData }),
        )
          .then((result) => {
            if (updateTrade.fulfilled.match(result)) {
              toast.success("Trade updated successfully!", {
                description: `Updated ${formData.side} trade for ${formData.asset}`,
              });
              // Call onSubmit if provided (for example, to close the dialog)
              if (onSubmit) {
                onSubmit(formData);
              } else {
                router.push("/trade-history");
                router.refresh();
              }
            } else {
              throw new Error("Failed to update trade");
            }
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An error occurred while updating the trade";
            setError(errorMessage);
            toast.error("Failed to update trade", {
              description: errorMessage,
            });
          });
      } else if (onSubmit) {
        // Save new trade using onSubmit callback
        void dispatch(saveTrade(formData))
          .then((result) => {
            if (saveTrade.fulfilled.match(result)) {
              toast.success("Trade added successfully!", {
                description: `Added ${formData.side} trade for ${formData.asset}`,
              });
              onSubmit(formData);
            } else {
              throw new Error("Failed to save trade");
            }
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An error occurred while saving the trade";
            setError(errorMessage);
            toast.error("Failed to add trade", {
              description: errorMessage,
            });
          });
      } else {
        // Save new trade and redirect (when no onSubmit callback is provided)
        void dispatch(saveTrade(formData))
          .then((result) => {
            if (saveTrade.fulfilled.match(result)) {
              toast.success("Trade added successfully!", {
                description: `Added ${formData.side} trade for ${formData.asset}`,
              });
              router.push("/trade-history");
              router.refresh();
            } else {
              throw new Error("Failed to save trade");
            }
          })
          .catch((error) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "An error occurred while saving the trade";
            setError(errorMessage);
            toast.error("Failed to add trade", {
              description: errorMessage,
            });
          });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while saving the trade";
      setError(errorMessage);
      toast.error(
        existingTrade ? "Failed to update trade" : "Failed to add trade",
        {
          description: errorMessage,
        },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <EnhancedCard
      className="mx-auto w-full max-w-2xl rounded-xl"
      animateOnHover
    >
      <EnhancedCardHeader>
        <EnhancedCardTitle>{title}</EnhancedCardTitle>
        <EnhancedCardDescription>{description}</EnhancedCardDescription>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Date and Side */}
            <DateSideSection
              date={formData.date}
              side={formData.side}
              onDateChange={handleDateChange}
              onSideChange={handleSideChange}
            />

            {/* Asset */}
            <AssetInput
              value={formData.asset}
              onChange={handleAssetChange}
              allAssets={allAssets}
              onSelectAsset={handleAssetSelect}
              placeholder="e.g., AAPL, BTC, ETH"
              required
            />

            {/* Quantity and Price */}
            <QuantityPriceSection
              quantity={formData.quantity}
              price={formData.price}
              onQuantityChange={handleQuantityChange}
              onPriceChange={handlePriceChange}
            />

            {/* Fees */}
            <FeeInput
              fees={formData.fees}
              quantity={formData.quantity}
              price={formData.price}
              onFeesChange={handleFeesChange}
              initialFeeInputType={feeInputMethod}
            />
          </div>

          {/* Notes */}
          <NotesSection
            notes={formData.notes ?? ""}
            onNotesChange={handleNotesChange}
          />

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
              {isSubmitting
                ? existingTrade
                  ? "Updating..."
                  : "Saving..."
                : existingTrade
                  ? "Update Trade"
                  : "Save Trade"}
            </Button>
          </div>
        </form>
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
