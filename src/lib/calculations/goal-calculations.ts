import { type InvestmentGoal, type GoalAnalyticsMetrics, type GoalProgressAnalysis } from "@/types";

/**
 * Calculate goal analytics metrics
 * @param goals - Array of investment goals
 * @returns Goal analytics metrics object
 */
export const calculateGoalAnalyticsMetrics = (
  goals: InvestmentGoal[],
): GoalAnalyticsMetrics => {
  const totalGoals = goals.length;
  const now = new Date();
  
  const activeGoals = goals.filter(goal => new Date(goal.deadline) > now).length;
  const completedGoals = goals.filter(goal =>
    new Date(goal.deadline) <= now || goal.currentAmount >= goal.targetAmount
  ).length;
  
  const totalProgress = goals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
  const averageProgress = totalGoals > 0 ? totalProgress / totalGoals : 0;
  
  const totalTargetAmount = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrentAmount = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const overallCompletionRate = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;
  
  // Goals needing attention (less than 50% progress and less than 50% time remaining)
  const goalsNeedingAttention = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    const timeRemaining = deadline.getTime() - now.getTime();
    const totalTime = deadline.getTime() - new Date(goal.deadline).getTime(); // This should be the original creation time
    // For simplicity, we'll use a fixed start date or assume goals were created at the start of the year
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const totalTimeFromStart = deadline.getTime() - startOfYear.getTime();
    const timeProgress = totalTimeFromStart > 0 ?
      ((now.getTime() - startOfYear.getTime()) / totalTimeFromStart) * 100 : 0;
    
    return goal.progress < 50 && timeProgress > 50;
  }).length;
  
  // On track goals (progress is ahead of time progress)
  const onTrackGoals = goals.filter(goal => {
    const deadline = new Date(goal.deadline);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const totalTimeFromStart = deadline.getTime() - startOfYear.getTime();
    const timeProgress = totalTimeFromStart > 0 ?
      ((now.getTime() - startOfYear.getTime()) / totalTimeFromStart) * 100 : 0;
    
    return goal.progress >= timeProgress;
  }).length;
  
  const offTrackGoals = totalGoals - onTrackGoals;
  
  return {
    totalGoals,
    activeGoals,
    completedGoals,
    averageProgress,
    totalTargetAmount,
    totalCurrentAmount,
    overallCompletionRate,
    goalsNeedingAttention,
    onTrackGoals,
    offTrackGoals,
  };
};

/**
 * Calculate goal progress analysis
 * @param goal - Investment goal
 * @returns Goal progress analysis object
 */
export const calculateGoalProgressAnalysis = (
  goal: InvestmentGoal,
): GoalProgressAnalysis => {
  const now = new Date();
  const deadline = new Date(goal.deadline);
  const daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 24)));
  
  // Calculate required progress based on time elapsed
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const totalTimeFromStart = deadline.getTime() - startOfYear.getTime();
 const timeProgress = totalTimeFromStart > 0 ?
    ((now.getTime() - startOfYear.getTime()) / totalTimeFromStart) * 100 : 0;
  
  const requiredProgress = timeProgress;
  const isOnTrack = goal.progress >= requiredProgress;
  
  // Projected completion based on current progress rate
  const daysSinceStart = Math.ceil((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 24));
  const progressPerDay = daysSinceStart > 0 ? goal.progress / daysSinceStart : 0;
  const projectedDaysToComplete = progressPerDay > 0 ? (100 - goal.progress) / progressPerDay : 0;
  const projectedCompletion = progressPerDay > 0 ?
    Math.min(100, goal.progress + (daysRemaining * progressPerDay)) : goal.progress;
  
  // Recommended monthly contribution to get back on track
  let recommendedMonthlyContribution = 0;
  if (!isOnTrack && goal.targetAmount > goal.currentAmount && daysRemaining > 0) {
    const shortfall = goal.targetAmount - goal.currentAmount;
    const monthsRemaining = daysRemaining / 30;
    recommendedMonthlyContribution = monthsRemaining > 0 ? shortfall / monthsRemaining : shortfall;
  }
  
  return {
    goalId: goal.id,
    goalName: goal.name,
    currentProgress: goal.progress,
    requiredProgress,
    isOnTrack,
    daysRemaining,
    projectedCompletion,
    recommendedMonthlyContribution,
  };
};

/**
 * Calculate all goal progress analyses
 * @param goals - Array of investment goals
 * @returns Array of goal progress analyses
 */
export const calculateAllGoalProgressAnalyses = (
  goals: InvestmentGoal[],
): GoalProgressAnalysis[] => {
  return goals.map(goal => calculateGoalProgressAnalysis(goal));
};

/**
 * Calculate strategic insights for goal optimization
 * @param goals - Array of investment goals
 * @param analyses - Array of goal progress analyses
 * @returns Strategic insights object
 */
export const calculateGoalStrategicInsights = (
  goals: InvestmentGoal[],
  analyses: GoalProgressAnalysis[],
): {
  totalRecommendedMonthlyContribution: number;
  priorityGoals: string[];
  achievableGoals: string[];
  atRiskGoals: string[];
  overallGoalHealth: 'excellent' | 'good' | 'fair' | 'poor';
  projectedCompletionRate: number;
} => {
  // Calculate total recommended monthly contribution
  const totalRecommendedMonthlyContribution = analyses.reduce(
    (sum, analysis) => sum + analysis.recommendedMonthlyContribution,
    0
  );
  
  // Identify priority goals (closest to deadline or lowest progress)
  const priorityGoals = [...analyses]
    .sort((a, b) => {
      // Sort by days remaining (ascending) then by progress (ascending)
      if (a.daysRemaining !== b.daysRemaining) {
        return a.daysRemaining - b.daysRemaining;
      }
      return a.currentProgress - b.currentProgress;
    })
    .slice(0, 3)
    .map(analysis => analysis.goalId);
  
  // Identify achievable goals (on track or close to on track)
  const achievableGoals = analyses
    .filter(analysis => analysis.isOnTrack || analysis.projectedCompletion >= 90)
    .map(analysis => analysis.goalId);
  
  // Identify at-risk goals (off track with low projected completion)
  const atRiskGoals = analyses
    .filter(analysis => !analysis.isOnTrack && analysis.projectedCompletion < 70)
    .map(analysis => analysis.goalId);
  
  // Calculate overall goal health
  const onTrackGoals = analyses.filter(analysis => analysis.isOnTrack).length;
  const healthRatio = goals.length > 0 ? onTrackGoals / goals.length : 0;
  
  let overallGoalHealth: 'excellent' | 'good' | 'fair' | 'poor' = 'excellent';
  if (healthRatio >= 0.8) {
    overallGoalHealth = 'excellent';
  } else if (healthRatio >= 0.6) {
    overallGoalHealth = 'good';
  } else if (healthRatio >= 0.4) {
    overallGoalHealth = 'fair';
  } else {
    overallGoalHealth = 'poor';
  }
  
  // Calculate projected completion rate
  const totalProjectedCompletion = analyses.reduce(
    (sum, analysis) => sum + analysis.projectedCompletion,
    0
  );
  const projectedCompletionRate = analyses.length > 0
    ? totalProjectedCompletion / analyses.length
    : 0;
  
  return {
    totalRecommendedMonthlyContribution,
    priorityGoals,
    achievableGoals,
    atRiskGoals,
    overallGoalHealth,
    projectedCompletionRate,
  };
};