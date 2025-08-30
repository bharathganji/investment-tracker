import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getPortfolioHoldings } from "@/lib/data-store";

export const portfolioRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return getPortfolioHoldings();
  }),
});
