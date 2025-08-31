import * as React from "react";
import { cn } from "@/lib/utils";

interface EnhancedTableProps extends React.HTMLAttributes<HTMLTableElement> {
  variant?: "default" | "financial";
}

type EnhancedTableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;

type EnhancedTableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

interface EnhancedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  variant?: "default" | "positive" | "negative";
}

type EnhancedTableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;

interface EnhancedTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  variant?: "default" | "financial" | "positive" | "negative";
  align?: "left" | "center" | "right";
}

const EnhancedTable = React.forwardRef<
  HTMLTableElement,
  EnhancedTableProps
>(({ className, variant = "default", ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border border-border shadow-md">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
EnhancedTable.displayName = "EnhancedTable";

const EnhancedTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  EnhancedTableHeaderProps
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
EnhancedTableHeader.displayName = "EnhancedTableHeader";

const EnhancedTableBody = React.forwardRef<
  HTMLTableSectionElement,
  EnhancedTableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
EnhancedTableBody.displayName = "EnhancedTableBody";

const EnhancedTableRow = React.forwardRef<
  HTMLTableRowElement,
  EnhancedTableRowProps
>(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "",
    positive: "bg-green-50/50 dark:bg-green-900/20",
    negative: "bg-red-50/50 dark:bg-red-900/20",
  }[variant];
  
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        variantClasses,
        className
      )}
      {...props}
    />
  );
});
EnhancedTableRow.displayName = "EnhancedTableRow";

const EnhancedTableHead = React.forwardRef<
  HTMLTableCellElement,
  EnhancedTableHeadProps
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-xs md:text-sm",
      className
    )}
    {...props}
  />
));
EnhancedTableHead.displayName = "EnhancedTableHead";

const EnhancedTableCell = React.forwardRef<
  HTMLTableCellElement,
  EnhancedTableCellProps
>(({ className, variant = "default", align = "left", ...props }, ref) => {
  const variantClasses = {
    default: "",
    financial: "font-mono",
    positive: "text-green-600 dark:text-green-400 font-medium",
    negative: "text-red-600 dark:text-red-400 font-medium",
  }[variant];
  
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
 }[align];
  
  return (
    <td
      ref={ref}
      className={cn(
        "p-2 align-middle [&:has([role=checkbox])]:pr-0 text-sm md:text-base",
        variantClasses,
        alignClasses,
        className
      )}
      {...props}
    />
  );
});
EnhancedTableCell.displayName = "EnhancedTableCell";

export {
  EnhancedTable,
  EnhancedTableHeader,
  EnhancedTableBody,
  EnhancedTableRow,
  EnhancedTableHead,
  EnhancedTableCell,
};