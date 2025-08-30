import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
