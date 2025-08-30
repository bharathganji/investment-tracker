import React from "react";
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from "@/components/ui/enhanced-card";
import { Progress } from "@/components/ui/progress";
import { Circle, CheckCircle } from "lucide-react";
import { cn, financialColors } from "@/lib/utils";
import { motion } from "framer-motion";

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
 deadline?: Date;
 className?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
 current,
  target,
  deadline,
  className,
}) => {
  const progress = Math.min(100, (current / target) * 100);
  const isCompleted = progress >= 100;
  
  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
    >
      <EnhancedCard className={cn("w-full", className)} animateOnHover>
        <EnhancedCardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <EnhancedCardTitle className="text-sm font-medium">{title}</EnhancedCardTitle>
            {isCompleted ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </motion.div>
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          {deadline && (
            <EnhancedCardDescription className="text-xs">
              Due: {formatDate(deadline)}
            </EnhancedCardDescription>
          )}
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="flex justify-between text-sm mb-1">
            <span className={`font-medium financial-number ${financialColors.profit}`}>${current.toLocaleString()}</span>
            <span className="text-muted-foreground financial-number">${target.toLocaleString()}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground mt-2">
            {progress.toFixed(1)}% complete
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </motion.div>
  );
};