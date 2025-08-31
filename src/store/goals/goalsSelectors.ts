import { createSelector } from '@reduxjs/toolkit';
import { type RootState } from '../index';
import { type InvestmentGoal, type SerializableInvestmentGoal } from '@/types';
import { fromSerializableInvestmentGoal } from '@/lib/utils';
import { calculateGoalAnalyticsMetrics, calculateAllGoalProgressAnalyses, calculateGoalStrategicInsights } from '@/lib/calculations/goal-calculations';
import { type GoalAnalyticsMetrics, type GoalProgressAnalysis } from '@/types';

// Basic selectors
export const selectGoalsState = (state: RootState) => state.goals;

export const selectSerializableGoals = (state: RootState) => state.goals.goals;

export const selectGoals = createSelector(
  [selectSerializableGoals],
  (serializableGoals) => serializableGoals.map(fromSerializableInvestmentGoal)
);

export const selectGoalsLoading = (state: RootState) => state.goals.loading;

export const selectGoalsError = (state: RootState) => state.goals.error;

// Memoized selectors using createSelector
export const selectGoalsWithProgress = createSelector(
  [selectGoals],
  (goals) => goals.map(goal => ({
    ...goal,
    progress: goal.progress || 0
  }))
);

export const selectActiveGoals = createSelector(
  [selectGoals],
  (goals) => goals.filter(goal => 
    new Date(goal.deadline).getTime() > Date.now()
  )
);

export const selectCompletedGoals = createSelector(
  [selectGoals],
  (goals) => goals.filter(goal => 
    new Date(goal.deadline).getTime() <= Date.now() || 
    (goal.currentAmount >= goal.targetAmount)
  )
);

export const selectGoalById = createSelector(
  [selectGoals, (_, id: string) => id],
  (goals, id) => goals.find(goal => goal.id === id) ?? null
);

export const selectGoalsCount = createSelector(
  [selectGoals],
  (goals) => goals.length
);

export const selectTotalTargetAmount = createSelector(
  [selectGoals],
  (goals) => goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
);

export const selectTotalCurrentAmount = createSelector(
  [selectGoals],
  (goals) => goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
);

// Goal analytics selectors
export const selectGoalAnalyticsMetrics = createSelector(
  [selectGoals],
  (goals): GoalAnalyticsMetrics => calculateGoalAnalyticsMetrics(goals)
);

export const selectGoalProgressAnalyses = createSelector(
  [selectGoals],
  (goals): GoalProgressAnalysis[] => calculateAllGoalProgressAnalyses(goals)
);

export const selectGoalsNeedingAttention = createSelector(
  [selectGoalProgressAnalyses],
  (analyses: GoalProgressAnalysis[]) => analyses.filter((analysis: GoalProgressAnalysis) => !analysis.isOnTrack)
);

export const selectOnTrackGoals = createSelector(
  [selectGoalProgressAnalyses],
  (analyses: GoalProgressAnalysis[]) => analyses.filter((analysis: GoalProgressAnalysis) => analysis.isOnTrack)
);

export const selectGoalProgressAnalysisById = createSelector(
  [selectGoalProgressAnalyses, (_, id: string) => id],
  (analyses: GoalProgressAnalysis[], id: string) => analyses.find((analysis: GoalProgressAnalysis) => analysis.goalId === id) ?? null
);

export const selectGoalStrategicInsights = createSelector(
  [selectGoals, selectGoalProgressAnalyses],
  (goals, analyses) => calculateGoalStrategicInsights(goals, analyses)
);