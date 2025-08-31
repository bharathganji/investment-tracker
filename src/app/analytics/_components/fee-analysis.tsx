import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardHeader,
  EnhancedCardTitle,
  EnhancedCardDescription,
} from "@/components/ui/enhanced-card";
import { LazyFeeAnalysis } from "./lazy-charts";

export function FeeAnalysis() {
  return <LazyFeeAnalysis />;
}