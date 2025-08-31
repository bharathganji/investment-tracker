import { calculateEnhancedPerformanceMetrics } from "@/lib/calculations/enhanced-metrics";
import { calculateFeesPaid } from "@/lib/calculations/basic";
import { getTrades } from "@/lib/data-store";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getPerformanceMetrics: publicProcedure.query(() => {
    try {
      const trades = getTrades();
      const metrics = calculateEnhancedPerformanceMetrics(trades);
      return metrics;
    } catch (error) {
      console.error("Error calculating performance metrics:", error);
      throw new Error("Failed to calculate performance metrics");
    }
  }),

  getFeesPaid: publicProcedure.query(() => {
    try {
      const trades = getTrades();
      const fees = calculateFeesPaid(trades);
      return fees;
    } catch (error) {
      console.error("Error calculating fees paid:", error);
      throw new Error("Failed to calculate fees paid");
    }
  }),
});
