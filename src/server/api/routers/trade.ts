import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  saveTrade,
  getTrades,
  updateTrade,
  deleteTrade,
} from "@/lib/data-store";
import { TradeFormData } from "@/types";

const tradeInputSchema = z.object({
  date: z.date(),
  asset: z.string().min(1),
  side: z.enum(["buy", "sell"]),
  quantity: z.number().positive(),
  price: z.number().positive(),
  fees: z.number().min(0),
  tradeType: z.enum(["maker", "taker"]),
  notes: z.string().optional(),
});

export const tradeRouter = createTRPCRouter({
  create: publicProcedure
    .input(tradeInputSchema)
    .mutation(async ({ input }) => {
      const trade = saveTrade(input);
      return trade;
    }),

  getAll: publicProcedure.query(() => {
    return getTrades();
  }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: tradeInputSchema.partial() }))
    .mutation(async ({ input }) => {
      const updatedTrade = updateTrade(input.id, input.data);
      if (!updatedTrade) {
        throw new Error("Trade not found");
      }
      return updatedTrade;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deleted = deleteTrade(input.id);
      if (!deleted) {
        throw new Error("Trade not found");
      }
      return { success: true };
    }),
});
