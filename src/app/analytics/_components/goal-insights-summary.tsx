"use client";

import { useMemo } from "react";
import { useAppSelector } from '@/store/hooks';
import { selectGoalStrategicInsights, selectGoals, selectGoalProgressAnalyses } from '@/store/goals/goalsSelectors';
import { 
  EnhancedCard, 
  EnhancedCardContent, 
  EnhancedCardDescription, 
  EnhancedCardHeader, 
  EnhancedCardTitle 
} from "@/components/ui/enhanced-card";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { financialColors } from "@/lib/utils";

export function GoalInsightsSummary() {
  const goals = useAppSelector(selectGoals);
  const insights = useAppSelector(selectGoalStrategicInsights);
  const analyses = useAppSelector(selectGoalProgressAnalyses);

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Get goal names for priority goals
  const priorityGoalNames = useMemo(() => {
    return insights.priorityGoals
      .map(goalId => {
        const goal = goals.find(g => g.id === goalId);
        return goal ? goal.name : '';
      })
      .filter(name => name !== '');
  }, [insights.priorityGoals, goals]);

  // Get goal names for at-risk goals
  const atRiskGoalNames = useMemo(() => {
    return insights.atRiskGoals
      .map(goalId => {
        const goal = goals.find(g => g.id === goalId);
        return goal ? goal.name : '';
      })
      .filter(name => name !== '');
  }, [insights.atRiskGoals, goals]);

  // Calculate key metrics for display
  const metrics = useMemo(() => {
    return [
      {
        title: "Recommended Monthly Contribution",
        value: formatCurrency(insights.totalRecommendedMonthlyContribution),
        change: undefined,
      },
      {
        title: "Projected Completion Rate",
        value: `${insights.projectedCompletionRate.toFixed(1)}%`,
        change: undefined,
      },
      {
        title: "Priority Goals",
        value: insights.priorityGoals.length,
        change: undefined,
      },
      {
        title: "At-Risk Goals",
        value: insights.atRiskGoals.length,
        change: undefined,
      },
    ];
  }, [insights]);

  // Determine health color
  const healthColor = useMemo(() => {
    switch (insights.overallGoalHealth) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-green-400';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  }, [insights.overallGoalHealth]);

  if (goals.length === 0) {
    return (
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Goal Insights</EnhancedCardTitle>
          <EnhancedCardDescription>
            Strategic insights for your investment goals
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No goals set yet. Create investment goals to get strategic insights.
            </p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <StatCard
            key={index}
            title={metric.title}
            value={metric.value}
            change={metric.change}
          />
        ))}
      </div>

      {/* Overall Health */}
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Overall Goal Health</EnhancedCardTitle>
          <EnhancedCardDescription>
            Strategic assessment of your investment goals
          </EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <Badge 
              className={`text-lg px-4 py-2 ${healthColor}`}
              variant="secondary"
            >
              {insights.overallGoalHealth.charAt(0).toUpperCase() + insights.overallGoalHealth.slice(1)}
            </Badge>
            <p className="text-center text-muted-foreground">
              {insights.overallGoalHealth === 'excellent' && 'Great job! Your goals are on track.'}
              {insights.overallGoalHealth === 'good' && 'Good progress! Keep up the good work.'}
              {insights.overallGoalHealth === 'fair' && 'Some goals need attention. Review your strategy.'}
              {insights.overallGoalHealth === 'poor' && 'Several goals are at risk. Take action now.'}
            </p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>

      {/* Priority Goals */}
      {priorityGoalNames.length > 0 && (
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>Priority Goals</EnhancedCardTitle>
            <EnhancedCardDescription>
              Goals requiring immediate attention
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="space-y-2">
              {priorityGoalNames.map((name, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{name}</span>
                  <Badge variant="outline">Priority</Badge>
                </div>
              ))}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      )}

      {/* At-Risk Goals */}
      {atRiskGoalNames.length > 0 && (
        <EnhancedCard className="rounded-xl" animateOnHover>
          <EnhancedCardHeader>
            <EnhancedCardTitle>At-Risk Goals</EnhancedCardTitle>
            <EnhancedCardDescription>
              Goals that may not be achieved on time
            </EnhancedCardDescription>
          </EnhancedCardHeader>
          <EnhancedCardContent>
            <div className="space-y-2">
              {atRiskGoalNames.map((name, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="font-medium">{name}</span>
                  <Badge variant="destructive">At Risk</Badge>
                </div>
              ))}
            </div>
          </EnhancedCardContent>
        </EnhancedCard>
      )}
    </div>
  );
}