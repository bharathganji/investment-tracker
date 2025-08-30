"use client";

import { useState, useEffect } from "react";
import { getGoals } from "@/lib/data-store";
import { type InvestmentGoal } from "@/types";
import { ProgressCard } from "@/components/progress-card";
import { GoalTracker } from "@/app/_components/goal-tracker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GoalsPage() {
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      const goalData = getGoals();
      setGoals(goalData);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="space-y-6 p-4 md:p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Investment Goals</h1>
          <p className="text-muted-foreground">
            Track and manage your investment goals
          </p>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading goals...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold md:text-3xl">Investment Goals</h1>
        <p className="text-muted-foreground">
          Track and manage your investment goals
        </p>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Goals Yet</CardTitle>
            <CardDescription>
              Set and track your investment goals to stay focused on your
              financial objectives.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Get started by creating your first investment goal.
              </p>
              <GoalTracker onGoalUpdate={loadGoals} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <ProgressCard
                key={goal.id}
                title={goal.name}
                current={goal.currentAmount}
                target={goal.targetAmount}
                deadline={goal.deadline}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Goals</CardTitle>
              <CardDescription>
                Detailed view of all your investment goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GoalTracker onGoalUpdate={loadGoals} />
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
}
