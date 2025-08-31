import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Trade, type SerializableTrade, type InvestmentGoal, type SerializableInvestmentGoal } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const financialColors = {
  profit: "text-profit",
  loss: "text-loss",
  info: "text-info",
  neutral: "text-muted-foreground",
};

export const brandGradient = {
  className: "brand-gradient",
  style: {
    background: "linear-gradient(to right, hsl(var(--brand-gradient-start)), hsl(var(--brand-gradient-end)))",
  },
};

// Utility functions for converting between Trade and SerializableTrade
export function toSerializableTrade(trade: Trade): SerializableTrade {
  return {
    ...trade,
    date: trade.date.toISOString(),
  };
}

// Utility functions for converting between InvestmentGoal and SerializableInvestmentGoal
export function toSerializableInvestmentGoal(goal: InvestmentGoal): SerializableInvestmentGoal {
  return {
    ...goal,
    deadline: goal.deadline.toISOString(),
  };
}

export function fromSerializableInvestmentGoal(serializableGoal: SerializableInvestmentGoal): InvestmentGoal {
  return {
    ...serializableGoal,
    deadline: new Date(serializableGoal.deadline),
  };
}

export function fromSerializableTrade(serializableTrade: SerializableTrade): Trade {
  return {
    ...serializableTrade,
    date: new Date(serializableTrade.date),
  };
}
