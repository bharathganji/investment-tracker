"use client";

import { DashboardStats } from "@/app/_components/dashboard-stats";
import { TradeHistoryTable } from "@/app/_components/trade-history-table";
import { GoalTracker } from "@/app/_components/goal-tracker";
import { PortfolioValueChart } from "@/app/_components/charts/portfolio-value-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your investment portfolio and performance
        </p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>Your portfolio value over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <PortfolioValueChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent trades and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TradeHistoryTable limit={5} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Goals</CardTitle>
              <CardDescription>
                Track your progress towards financial targets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalTracker limit={3} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
