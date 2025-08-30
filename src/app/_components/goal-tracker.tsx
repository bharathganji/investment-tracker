"use client";

import { useState, useEffect } from 'react';
import { getGoals, saveGoal } from '@/lib/data-store';
import { type InvestmentGoal } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export function GoalTracker({ limit, onGoalUpdate }: GoalTrackerProps) {
  const [goals, setGoals] = useState<InvestmentGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date(),
    assignedAssets: [] as string[],
    progress: 0
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    try {
      const goalData = getGoals();
      setGoals(limit ? goalData.slice(0, limit) : goalData);
    } catch (error) {
      console.error('Error loading goals:', error);
      toast.error("Failed to load goals", {
        description: "There was an error loading your investment goals.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: name === 'targetAmount' || name === 'currentAmount'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleAddGoal = () => {
    try {
      // Basic validation
      if (!newGoal.name.trim()) {
        throw new Error("Goal name is required");
      }
      if (newGoal.targetAmount <= 0) {
        throw new Error("Target amount must be greater than 0");
      }

      const progress = newGoal.targetAmount > 0 ? (newGoal.currentAmount / newGoal.targetAmount) * 100 : 0;
      saveGoal({
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: newGoal.currentAmount,
        deadline: newGoal.deadline,
        progress,
        assignedAssets: newGoal.assignedAssets
      });
      
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date(),
        assignedAssets: [],
        progress: 0
      });
      
      setShowAddGoal(false);
      loadGoals();
      
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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investment Goals</CardTitle>
          <CardDescription>Loading goals...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading goals...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{limit ? 'Recent Goals' : 'Investment Goals'}</CardTitle>
            <CardDescription>Track your investment targets and progress</CardDescription>
          </div>
          <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
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
                    value={newGoal.deadline.toISOString().split('T')[0]}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: new Date(e.target.value) }))}
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
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No investment goals set yet.</p>
            <Button onClick={() => setShowAddGoal(true)}>Create Your First Goal</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.map((goal) => (
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
                  <span>Deadline: {goal.deadline.toLocaleDateString()}</span>
                  {goal.assignedAssets.length > 0 && (
                    <span>{goal.assignedAssets.length} assets</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
