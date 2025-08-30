import React from "react";
import { EnhancedCard, EnhancedCardContent, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { StatCardProps } from "@/types";
import { cn, financialColors } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/use-count-up";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
}) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  // Handle number count-up for numeric values
  const numericValue = typeof value === "number" ? value : 0;
  const countUpValue = useCountUp(numericValue);
  const displayValue = typeof value === "number"
    ? countUpValue.toLocaleString()
    : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    >
      <EnhancedCard className={cn("w-full", className)} animateOnHover>
        <EnhancedCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <EnhancedCardTitle className="text-sm font-medium">{title}</EnhancedCardTitle>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-2xl font-bold financial-number">{displayValue}</div>
          {change !== undefined && (
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {isPositive ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : isNegative ? (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              ) : null}
              <span className={cn(isPositive ? financialColors.profit : isNegative ? financialColors.loss : financialColors.neutral)}>
                {isPositive ? "+" : ""}
                {change?.toFixed(2)}%
              </span>
            </p>
          )}
        </EnhancedCardContent>
      </EnhancedCard>
    </motion.div>
  );
};