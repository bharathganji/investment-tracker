# Implementation Plan

This plan outlines the development of a comprehensive investment tracker application with features for trade logging, portfolio management, performance analytics, and goal tracking.

## Overview

Build a full-featured investment tracker application using Next.js, TypeScript, Tailwind CSS, and tRPC with local storage persistence that can be upgraded to Supabase integration. The application will track trades, analyze performance, and monitor goal progress with a responsive UI, utilizing shadcn/ui components and other libraries for enhanced functionality.

## Types

Define comprehensive type definitions for all investment tracking entities including trades, portfolio holdings, goals, and analytics data.

### Core Data Models

```typescript
// Trade types
interface Trade {
  id: string;
  date: Date;
  asset: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  fees: number;
  notes?: string;
}

// Portfolio holding types
interface PortfolioHolding {
  asset: string;
  quantity: number;
  averageCost: number;
  currentValue: number;
  totalCost: number;
  unrealizedPnL: number;
  unrealizedPnLPercentage: number;
}

// Goal types
interface InvestmentGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  progress: number;
  assignedAssets: string[];
}

// Analytics types
interface PerformanceMetrics {
  totalTrades: number;
  totalProfitLoss: number;
  totalFeesPaid: number;
  roi: number;
  cagr: number;
  dailyReturns: number[];
  weeklyReturns: number[];
  monthlyReturns: number[];
}
```

## Files

Create new files for all components, pages, and API routes while modifying existing placeholder files.

### New Files to Create

- `src/app/trade-entry/page.tsx` - Trade entry form page
- `src/app/_components/trade-form.tsx` - Reusable trade entry form component
- `src/app/_components/dashboard-stats.tsx` - Dashboard statistics component
- `src/app/_components/portfolio-table.tsx` - Portfolio holdings table
- `src/app/_components/trade-history-table.tsx` - Trade history table
- `src/app/_components/goal-tracker.tsx` - Goal tracking component
- `src/app/_components/charts/portfolio-chart.tsx` - Portfolio value chart
- `src/app/_components/charts/performance-chart.tsx` - Performance metrics chart
- `src/lib/data-store.ts` - Local storage data management
- `src/lib/calculations.ts` - Financial calculations utilities
- `src/server/api/routers/trade.ts` - Trade API router
- `src/server/api/routers/portfolio.ts` - Portfolio API router
- `src/server/api/routers/goals.ts` - Goals API router
- `src/server/api/routers/analytics.ts` - Analytics API router
- `src/types/index.ts` - Type definitions

### Existing Files to Modify

- `src/app/page.tsx` - Update home page with proper navigation
- `src/app/dashboard/page.tsx` - Implement dashboard with charts and stats
- `src/app/portfolio/page.tsx` - Implement portfolio view with holdings
- `src/app/trade-history/page.tsx` - Implement trade history with filtering
- `src/app/analytics/page.tsx` - Implement analytics with charts and metrics
- `src/app/goals/page.tsx` - Implement goals management
- `src/app/settings/page.tsx` - Implement settings with theme toggle
- `src/server/api/root.ts` - Add new API routers

## Functions

Create comprehensive functions for data management, calculations, and API operations.

### New Functions

#### Data Store Functions (`src/lib/data-store.ts`)

- `getTrades(): Trade[]` - Retrieve all trades from storage
- `saveTrade(trade: Trade): void` - Save a new trade
- `updateTrade(id: string, trade: Trade): void` - Update existing trade
- `deleteTrade(id: string): void` - Delete a trade
- `getPortfolioHoldings(): PortfolioHolding[]` - Calculate portfolio holdings
- `getGoals(): InvestmentGoal[]` - Retrieve investment goals
- `saveGoal(goal: InvestmentGoal): void` - Save investment goal
- `updateGoal(id: string, goal: InvestmentGoal): void` - Update investment goal

#### Calculation Functions (`src/lib/calculations.ts`)

- `calculatePortfolioValue(holdings: PortfolioHolding[]): number` - Calculate total portfolio value
- `calculatePnL(trades: Trade[]): number` - Calculate profit/loss
- `calculateROI(initialValue: number, finalValue: number): number` - Calculate return on investment
- `calculateCAGR(initialValue: number, finalValue: number, years: number): number` - Calculate compound annual growth rate
- `calculateFeesPaid(trades: Trade[]): number` - Calculate total fees paid
- `calculateDailyReturns(trades: Trade[]): number[]` - Calculate daily returns
- `calculatePerformanceMetrics(trades: Trade[]): PerformanceMetrics` - Calculate comprehensive performance metrics

#### API Functions (Various router files)

- `createTrade(input: CreateTradeInput)` - Create new trade
- `getTrades()` - Get all trades
- `updateTrade(input: UpdateTradeInput)` - Update existing trade
- `deleteTrade(input: DeleteTradeInput)` - Delete trade
- `getPortfolio()` - Get portfolio holdings
- `getPerformanceMetrics()` - Get performance analytics
- `createGoal(input: CreateGoalInput)` - Create investment goal
- `getGoals()` - Get all goals
- `updateGoal(input: UpdateGoalInput)` - Update goal

## Classes

No new classes needed as we'll use functional components and interfaces.

### Modified Classes

- `AppRouter` in `src/server/api/root.ts` - Add new routers

## Dependencies

Add required dependencies for charts and enhanced functionality.

### New Dependencies

- `recharts` - Charting library for data visualization
- `date-fns` - Date manipulation utilities
- `uuid` - Unique ID generation
- `@radix-ui/react-dialog` - Accessible dialog component
- `@radix-ui/react-dropdown-menu` - Accessible dropdown menu component
- `@radix-ui/react-label` - Accessible label component
- `@radix-ui/react-select` - Accessible select component
- `@radix-ui/react-slot` - Slot component for composition
- `@radix-ui/react-switch` - Accessible switch component
- `@radix-ui/react-tabs` - Accessible tabs component
- `class-variance-authority` - Utility for creating class variants
- `clsx` - Utility for constructing className strings
- `tailwind-merge` - Utility for merging Tailwind CSS classes
- `@heroicons/react` - Beautiful SVG icons
- `react-hook-form` - Form validation and management
- `zod` - Schema declaration and validation

## UI Components and Libraries

Leverage existing component libraries to accelerate development and ensure consistent UI/UX.

### Implemented shadcn/ui Components

- `Button` - Primary and secondary buttons for actions ✅
- `Card` - Container components for dashboard widgets and data displays ✅
- `Table` - Data tables for trade history and portfolio holdings ✅
- `Input` - Form input fields with validation ✅
- `Select` - Dropdown selectors for trade types and assets ✅
- `DatePicker` - Date selection components ✅
- `Dialog` - Modal dialogs for forms and confirmations ✅
- `Tabs` - Tabbed interfaces for navigation ✅
- `Switch` - Toggle switches for settings ✅
- `Progress` - Progress bars for goal tracking ✅
- `Chart` - Charting components (wrapping Recharts) ✅
- `Skeleton` - Loading skeletons for better UX ✅
- `Label` - Accessible form labels ✅
- `Textarea` - Multi-line text inputs ✅
- `Form` - Form components with validation ✅

### Third-party Libraries

- `Recharts` - For data visualization and financial charts ✅
- `date-fns` - For date manipulation and formatting ✅
- `react-hook-form` - For form validation and management ✅
- `zod` - For schema declaration and validation ✅
- `uuid` - For unique ID generation ✅
- `@tanstack/react-virtual` - Virtualized scrolling for large lists ✅
- `sonner` - Toast notifications ✅
- `lucide-react` - Beautiful SVG icons ✅
- `next-themes` - Theme management ✅

### Performance & UX Enhancements

- `TanStack Virtual` - Virtualized scrolling for large datasets ✅
- `Sonner` - Beautiful toast notifications ✅
- `Class Variance Authority` - Component variants for consistent styling ✅

### Custom Components Created

- `TradeForm` - Reusable trade entry form component ✅
- `PortfolioTable` - Portfolio holdings table with P&L calculations ✅
- `TradeHistoryTable` - Trade history table with filtering and sorting ✅
- `GoalTracker` - Goal tracking component with progress visualization ✅
- `PortfolioValueChart` - Portfolio value chart using Recharts ✅
- `PerformanceChart` - Performance metrics chart using Recharts ✅
- `DashboardStats` - Dashboard statistics cards with key metrics ✅

### Component Status

✅ Completed - Fully implemented and tested
🔄 In Progress - Partially implemented, needs refinement
⏸️ Planned - Scheduled for future implementation

## Testing

Implement comprehensive testing for critical functions and components.

### Test Files

- `src/lib/calculations.test.ts` - Unit tests for financial calculations
- `src/lib/data-store.test.ts` - Unit tests for data storage
- `src/app/_components/trade-form.test.tsx` - Component tests for trade form
- `src/server/api/routers/trade.test.ts` - API router tests

## Implementation Order

Follow a logical sequence to minimize conflicts and ensure successful integration.

1. Create type definitions and data store utilities
2. Implement trade management API and components
3. Build portfolio calculation logic and views
4. Create analytics and performance metrics
5. Implement goal tracking functionality
6. Develop dashboard with charts and statistics
7. Enhance UI/UX with responsive design and theming
8. Add comprehensive testing
9. Implement data export and backup features
10. Add authentication and user management
