"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { ProgressCard } from "@/components/progress-card";
import { GoalTracker } from "@/app/_components/goal-tracker";
import { GoalAnalytics } from "@/app/goals/_components/goal-analytics";
import {
  EnhancedCard,
  EnhancedCardContent,
  EnhancedCardDescription,
  EnhancedCardHeader,
  EnhancedCardTitle,
} from "@/components/ui/enhanced-card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function GoalsPage() {
  const goalsState = useAppSelector((state) => state.goals);
  const goals = goalsState && "goals" in goalsState ? goalsState.goals : [];
  const goalsLoading =
    goalsState && "loading" in goalsState ? goalsState.loading : false;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Update loading state when goals data changes
    setLoading(goalsLoading);
  }, [goalsLoading]);

  const handleGoalUpdate = () => {
    // This function can be used to trigger any updates if needed
    // For now, the GoalTracker component handles its own updates
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
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading goals...</p>
          </EnhancedCardContent>
        </EnhancedCard>
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {goals.length === 0 ? (
            <EnhancedCard className="rounded-xl" animateOnHover>
              <EnhancedCardHeader>
                <EnhancedCardTitle>No Goals Yet</EnhancedCardTitle>
                <EnhancedCardDescription>
                  Set and track your investment goals to stay focused on your
                  financial objectives.
                </EnhancedCardDescription>
              </EnhancedCardHeader>
              <EnhancedCardContent>
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Get started by creating your first investment goal.
                  </p>
                  <GoalTracker
                    key="no-goals"
                    instanceId="no-goals"
                    onGoalUpdate={handleGoalUpdate}
                  />
                </div>
              </EnhancedCardContent>
            </EnhancedCard>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <ProgressCard
                    key={goal.id}
                    title={goal.name}
                    current={goal.currentAmount}
                    target={goal.targetAmount}
                    deadline={new Date(goal.deadline)}
                  />
                ))}
              </div>

              <EnhancedCard className="rounded-xl" animateOnHover>
                <EnhancedCardHeader>
                  <EnhancedCardTitle>All Goals</EnhancedCardTitle>
                  <EnhancedCardDescription>
                    Detailed view of all your investment goals
                  </EnhancedCardDescription>
                </EnhancedCardHeader>
                <EnhancedCardContent>
                  <GoalTracker
                    key="with-goals"
                    instanceId="with-goals"
                    onGoalUpdate={handleGoalUpdate}
                  />
                </EnhancedCardContent>
              </EnhancedCard>
            </>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <GoalAnalytics />
        </TabsContent>
      </Tabs>
    </section>
  );
}
