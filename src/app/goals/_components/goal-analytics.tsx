"use client";

import { useMemo } from "react";
import { useAppSelector } from '@/store/hooks';
import { selectGoalAnalyticsMetrics, selectGoalProgressAnalyses, selectGoalsNeedingAttention } from '@/store/goals/goalsSelectors';
import { 
  EnhancedCard, 
  EnhancedCardContent, 
  EnhancedCardDescription, 
  EnhancedCardHeader, 
  EnhancedCardTitle 
} from "@/components/ui/enhanced-card";
import { StatCard } from "@/components/stat-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { financialColors } from "@/lib/utils";

export function GoalAnalytics() {
  const analyticsMetrics = useAppSelector(selectGoalAnalyticsMetrics);
  const progressAnalyses = useAppSelector(selectGoalProgressAnalyses);
  const goalsNeedingAttention = useAppSelector(selectGoalsNeedingAttention);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate key metrics for display
  const metrics = useMemo(() => {
    return [
      {
        title: "Total Goals",
        value: analyticsMetrics.totalGoals,
        change: undefined,
      },
      {
        title: "Active Goals",
        value: analyticsMetrics.activeGoals,
        change: undefined,
      },
      {
        title: "Completed Goals",
        value: analyticsMetrics.completedGoals,
        change: undefined,
      },
      {
        title: "Avg Progress",
        value: `${analyticsMetrics.averageProgress.toFixed(1)}%`,
        change: undefined,
      },
      {
        title: "Total Target",
        value: formatCurrency(analyticsMetrics.totalTargetAmount),
        change: undefined,
      },
      {
        title: "Overall Completion",
        value: `${analyticsMetrics.overallCompletionRate.toFixed(1)}%`,
        change: undefined,
      },
    ];
  }, [analyticsMetrics]);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
          />
        ))}
      </div>

      {/* Goals Needing Attention */}
      {goalsNeedingAttention.length > 0 && (
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Goals Needing Attention</EnhancedCardTitle>
            <EnhancedCardDescription>
              These goals require immediate action to stay on track
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="space-y-4">
              {goalsNeedingAttention.map((analysis) => {
                const goal = progressAnalyses.find(g => g.goalId === analysis.goalId);
                if (!goal) return null;
                
                return (
                  <div key={analysis.goalId} className="space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{analysis.goalName}</h3>
                      <Badge variant="destructive">{analysis.currentProgress.toFixed(1)}%</Badge>
                    </div>
                    <Progress value={analysis.currentProgress} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        Recommended: {formatCurrency(analysis.recommendedMonthlyContribution)}/month
                      </span>
                      <span>{analysis.daysRemaining} days left</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      )}

      {/* Progress Analysis */}
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Goal Progress Analysis</EnhancedCardTitle>
          <EnhancedCardDescription>
            Detailed analysis of your goal progress
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="space-y-4">
            {progressAnalyses.map((analysis) => (
              <div key={analysis.goalId} className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-medium">{analysis.goalName}</h3>
                  <Badge
                    variant={analysis.isOnTrack ? "default" : "destructive"}
                  >
                    {analysis.isOnTrack ? "On Track" : "Off Track"}
                  </Badge>
                </div>
                <Progress
                  value={analysis.currentProgress}
                  className="w-full"
                />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Current:</span>{" "}
                    {analysis.currentProgress.toFixed(1)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Required:</span>{" "}
                    {analysis.requiredProgress.toFixed(1)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Projected:</span>{" "}
                    {analysis.projectedCompletion.toFixed(1)}%
                  </div>
                  <div>
                    <span className="text-muted-foreground">Days Left:</span>{" "}
                    {analysis.daysRemaining}
                  </div>
                </div>
                {!analysis.isOnTrack && analysis.recommendedMonthlyContribution > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Recommendation:</span> Increase your monthly 
                    contribution by {formatCurrency(analysis.recommendedMonthlyContribution)} 
                    to get back on track.
                  </div>
                )}
              </div>
            ))}
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    </div>
  );
}