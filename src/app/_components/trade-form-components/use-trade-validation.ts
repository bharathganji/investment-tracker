"use client";

export interface TradeFormErrors {
  asset?: string;
  quantity?: string;
  price?: string;
 general?: string;
}

export function useTradeValidation() {
  const validateTradeForm = (formData: {
    asset: string;
    quantity: number;
    price: number;
  }): TradeFormErrors => {
    const errors: TradeFormErrors = {};

    // Basic validation
    if (!formData.asset.trim()) {
      errors.asset = "Asset is required";
    }
    if (formData.quantity <= 0) {
      errors.quantity = "Quantity must be greater than 0";
    }
    if (formData.price <= 0) {
      errors.price = "Price must be greater than 0";
    }

    return errors;
  };

  return { validateTradeForm };
}