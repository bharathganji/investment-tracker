"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadGoals, saveGoal } from '@/store/goals/goalsThunks';
import { type InvestmentGoal } from '@/types';
import { EnhancedCard, EnhancedCardContent, EnhancedCardDescription, EnhancedCardHeader, EnhancedCardTitle } from '@/components/ui/enhanced-card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

interface GoalTrackerProps {
 limit?: number;
  onGoalUpdate?: () => void;
  instanceId?: string;
}

interface NewGoalState {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // Date input returns a string
  assignedAssets: string[];
  progress: number;
}

export function GoalTracker({ limit, onGoalUpdate, instanceId }: GoalTrackerProps) {
  console.log('GoalTracker rendered with instanceId:', instanceId);
  const dispatch = useAppDispatch();
  const goals = useAppSelector((state) => state.goals.goals);
  const goalsLoading = useAppSelector((state) => state.goals.loading);
  
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<NewGoalState>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
    assignedAssets: [],
    progress: 0
  });
  const [displayGoals, setDisplayGoals] = useState<InvestmentGoal[]>([]);

  // Stable function for dialog onOpenChange handler
  const handleDialogOpenChange = useCallback((open: boolean) => {
    setShowAddGoal(open);
  }, []);

  // Memoized function to load goals data
  const loadGoalsData = useCallback(async () => {
    try {
      await dispatch(loadGoals()).unwrap();
    } catch (error) {
      console.error("Error loading goals:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    void loadGoalsData();
 }, [loadGoalsData]);

  useEffect(() => {
    // Update display goals when the goals data changes
    // Convert SerializableInvestmentGoal[] to InvestmentGoal[]
    const convertedGoals = goals.map(goal => ({
      ...goal,
      deadline: new Date(goal.deadline)
    }));
    setDisplayGoals(limit ? convertedGoals.slice(0, limit) : convertedGoals);
  }, [goals, limit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: name === 'targetAmount' || name === 'currentAmount'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleAddGoal = async () => {
    try {
      // Basic validation
      if (!newGoal.name.trim()) {
        throw new Error("Goal name is required");
      }
      if (newGoal.targetAmount <= 0) {
        throw new Error("Target amount must be greater than 0");
      }

      const progress = newGoal.targetAmount > 0 ? (newGoal.currentAmount / newGoal.targetAmount) * 100 : 0;
      
      // Validate deadline
      if (!newGoal.deadline) {
        throw new Error("Deadline is required");
      }
      
      // Convert deadline string to Date object
      const deadlineDate = new Date(newGoal.deadline);
      
      // Check if the date is valid
      if (isNaN(deadlineDate.getTime())) {
        throw new Error("Invalid deadline date");
      }
      
      const result = await dispatch(saveGoal({
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount,
        deadline: deadlineDate,
        progress,
        assignedAssets: newGoal.assignedAssets
      })).unwrap();
      
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date().toISOString().split('T')[0] ?? new Date().toISOString(),
        assignedAssets: [],
        progress: 0
      });
      
      setShowAddGoal(false);
      
      toast.success("Goal added successfully!", {
        description: `Created goal: ${newGoal.name}`,
      });
      
      if (onGoalUpdate) {
        onGoalUpdate();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add goal";
      console.error('Error adding goal:', error);
      toast.error("Failed to add goal", {
        description: errorMessage,
      });
    }
  };

  if (goalsLoading) {
    return (
      <EnhancedCard className="rounded-xl" animateOnHover>
        <EnhancedCardHeader>
          <EnhancedCardTitle>Investment Goals</EnhancedCardTitle>
          <EnhancedCardDescription>Loading goals...</EnhancedCardDescription>
        </EnhancedCardHeader>
        <EnhancedCardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading goals...</p>
          </div>
        </EnhancedCardContent>
      </EnhancedCard>
    );
  }

  return (
    <EnhancedCard className="rounded-xl" animateOnHover>
      <EnhancedCardHeader>
        <div className="flex justify-between items-center">
          <div>
            <EnhancedCardTitle>{limit ? 'Recent Goals' : 'Investment Goals'}</EnhancedCardTitle>
            <EnhancedCardDescription>Track your investment targets and progress</EnhancedCardDescription>
          </div>
          <Dialog open={showAddGoal} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">Add Goal</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Goal</DialogTitle>
                <DialogDescription>Create a new investment goal to track</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Retirement Fund, Emergency Savings"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAmount">Target Amount ($)</Label>
                    <Input
                      type="number"
                      id="targetAmount"
                      name="targetAmount"
                      value={newGoal.targetAmount || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentAmount">Current Amount ($)</Label>
                    <Input
                      type="number"
                      id="currentAmount"
                      name="currentAmount"
                      value={newGoal.currentAmount || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddGoal(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddGoal}>
                    Save Goal
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </EnhancedCardHeader>
      <EnhancedCardContent>
        {displayGoals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No investment goals set yet.</p>
            <Button onClick={() => setShowAddGoal(true)}>Create Your First Goal</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {displayGoals.map((goal) => (
              <div key={goal.id} className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </p>
                  </div>
                  <Badge variant="secondary">{goal.progress.toFixed(1)}%</Badge>
                </div>
                
                <Progress value={Math.min(goal.progress, 100)} className="w-full" />
                
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
                  {goal.assignedAssets.length > 0 && (
                    <span>{goal.assignedAssets.length} assets</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </EnhancedCardContent>
    </EnhancedCard>
  );
}
