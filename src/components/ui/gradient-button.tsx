import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", isLoading = false, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-navy-blue-500 to-light-blue-500 text-white hover:from-navy-blue-600 hover:to-light-blue-600 shadow-lg hover:shadow-xl transform transition-transform duration-200 hover:scale-105 active:scale-95",
      secondary: "border border-input bg-background hover:bg-accent hover:text-accent-foreground transform transition-transform duration-200 hover:scale-105 active:scale-95",
    }[variant];
    
    const sizeClasses = "h-10 py-2 px-4";
    
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variantClasses, sizeClasses, className)}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin">⏳</span>
            Loading...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);
GradientButton.displayName = "GradientButton";

export { GradientButton };