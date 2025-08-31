import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Card as BaseCard,
  CardHeader as BaseCardHeader,
  CardFooter as BaseCardFooter,
  CardTitle as BaseCardTitle,
  CardDescription as BaseCardDescription,
  CardContent as BaseCardContent
} from "@/components/ui/card";

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "enhanced";
  animateOnHover?: boolean;
}

const EnhancedCard = React.forwardRef<
  HTMLDivElement,
  EnhancedCardProps
>(({ className, variant = "default", animateOnHover = false, ...props }, ref) => {
  const baseClasses = "rounded-xl transition-all duration-300";
  const shadowClasses = "shadow-md hover:shadow-lg";
  const hoverClasses = animateOnHover ? "hover:-translate-y-1" : "";
  const variantClasses = variant === "enhanced" ? "border-0 bg-card/90 backdrop-blur-sm" : "";
  
  const cardContent = (
    <BaseCard
      ref={ref}
      className={cn(baseClasses, shadowClasses, hoverClasses, variantClasses, className)}
      {...props}
    />
  );
  
  if (animateOnHover) {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {cardContent}
      </motion.div>
    );
  }
  
  return cardContent;
});
EnhancedCard.displayName = "EnhancedCard";

const EnhancedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseCardHeader
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
EnhancedCardHeader.displayName = "EnhancedCardHeader";

const EnhancedCardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseCardTitle
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
EnhancedCardTitle.displayName = "EnhancedCardTitle";

const EnhancedCardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseCardDescription
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
EnhancedCardDescription.displayName = "EnhancedCardDescription";

const EnhancedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseCardContent
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  />
));
EnhancedCardContent.displayName = "EnhancedCardContent";

const EnhancedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <BaseCardFooter
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
EnhancedCardFooter.displayName = "EnhancedCardFooter";

export {
  EnhancedCard,
  EnhancedCardHeader,
  EnhancedCardFooter,
  EnhancedCardTitle,
  EnhancedCardDescription,
  EnhancedCardContent,
};