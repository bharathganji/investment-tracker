import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { saveGoal, getGoals, updateGoal, deleteGoal } from "@/lib/data-store";
import { type InvestmentGoal } from "@/types";

const goalInputSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  currentAmount: z.number().min(0),
  deadline: z.date(),
  assignedAssets: z.array(z.string()),
});

export const goalsRouter = createTRPCRouter({
  create: publicProcedure.input(goalInputSchema).mutation(async ({ input }) => {
    // Calculate progress
    const progress =
      input.targetAmount > 0
        ? (input.currentAmount / input.targetAmount) * 100
        : 0;
    const goalData: Omit<InvestmentGoal, "id"> = {
      ...input,
      progress,
    };
    const goal = saveGoal(goalData);
    return goal;
  }),

  getAll: publicProcedure.query(() => {
    return getGoals();
  }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: goalInputSchema.partial() }))
    .mutation(async ({ input }) => {
      // Calculate progress if amounts are updated
      let updatedData: Partial<InvestmentGoal> = { ...input.data };
      if ("targetAmount" in updatedData || "currentAmount" in updatedData) {
        const goals = getGoals();
        const existingGoal = goals.find((g) => g.id === input.id);
        if (existingGoal) {
          const targetAmount =
            updatedData.targetAmount ?? existingGoal.targetAmount;
          const currentAmount =
            updatedData.currentAmount ?? existingGoal.currentAmount;
          const progress =
            targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
          updatedData = { ...updatedData, progress };
        }
      }

      const updatedGoal = updateGoal(input.id, updatedData);
      if (!updatedGoal) {
        throw new Error("Goal not found");
      }
      return updatedGoal;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const deleted = deleteGoal(input.id);
      if (!deleted) {
        throw new Error("Goal not found");
      }
      return { success: true };
    }),
});
