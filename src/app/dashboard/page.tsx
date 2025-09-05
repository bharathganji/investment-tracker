"use client";

import { DashboardStats } from "@/app/_components/dashboard-stats";
import { TradeHistoryTable } from "@/app/_components/trade-history-table";
import { GoalTracker } from "@/app/_components/goal-tracker";
import { PortfolioValueChart } from "@/app/_components/charts/portfolio-value-chart";
import { motion } from "framer-motion";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <section className="space-y-8 p-4 md:p-6">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="heading-lg">Dashboard</h1>
          <p className="body-text text-muted-foreground">
            Overview of your investment portfolio and performance
          </p>
        </motion.div>

        <DashboardStats />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <motion.div
            className="space-y-6 xl:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <EnhancedCard
              className="rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg"
              animateOnHover
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="heading-md">
                  Portfolio Performance
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Your portfolio value over time
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent className="h-80">
                <PortfolioValueChart standalone={false} />
              </EnhancedCardContent>
            </EnhancedCard>

            <EnhancedCard
              className="rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg"
              animateOnHover
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="heading-md">
                  Recent Activity
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Your recent trades and transactions
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <TradeHistoryTable limit={5} />
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <EnhancedCard
              className="rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg"
              animateOnHover
            >
              <EnhancedCardHeader>
                <EnhancedCardTitle className="heading-md">
                  Investment Goals
                </EnhancedCardTitle>
                <EnhancedCardDescription>
                  Track your progress towards financial targets
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <GoalTracker limit={3} />
              </EnhancedCardContent>
            </EnhancedCard>
          </motion.div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
