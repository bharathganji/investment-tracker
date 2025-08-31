import { createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";
import { type InvestmentGoal, type SerializableInvestmentGoal } from '@/types';
import { InvestmentGoalSchema } from '@/types/schemas';
import { toSerializableInvestmentGoal, fromSerializableInvestmentGoal } from '@/lib/utils';
import { setLoading, setError, addGoal, setGoals, updateGoalLocal, removeGoal } from './goalsSlice';

// Helper function to safely parse goals from localStorage
const parseGoalsFromStorage = (): SerializableInvestmentGoal[] => {
  try {
    const goalsData = localStorage.getItem("investment-tracker-goals");
    if (!goalsData) return [];
    
    const goals: unknown = JSON.parse(goalsData);
    if (Array.isArray(goals)) {
      // Validate each goal and filter out invalid ones
      return goals.map((goal: unknown) => {
        if (typeof goal === "object" && goal !== null && "deadline" in goal) {
          // Ensure deadline is a string for Redux serialization compatibility
          const goalObj = goal as Record<string, unknown>;
          const serializableGoal: SerializableInvestmentGoal = {
            ...(goalObj as object),
            deadline: typeof goalObj.deadline === 'string' ? goalObj.deadline : new Date(goalObj.deadline as string).toISOString(),
          } as SerializableInvestmentGoal;
          
          // Validate that the goal has all required properties
          const validGoal = InvestmentGoalSchema.omit({ id: true }).safeParse({
            ...serializableGoal,
            deadline: new Date(serializableGoal.deadline),
          });
          
          if (validGoal.success) {
            return serializableGoal;
          }
        }
        return null;
      }).filter((goal): goal is SerializableInvestmentGoal => goal !== null);
    }
  } catch {
    // If parsing fails, return an empty array
  }
  return [];
};

// Async thunk to load goals from localStorage
export const loadGoals = createAsyncThunk(
  'goals/loadGoals',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const serializableGoals = parseGoalsFromStorage();
      // Convert to InvestmentGoal objects for use in components
      const goals = serializableGoals.map(fromSerializableInvestmentGoal);
      dispatch(setGoals(serializableGoals));
      dispatch(setLoading(false));
      return serializableGoals;
    } catch (error) {
      dispatch(setError("Failed to load goals from localStorage"));
      dispatch(setLoading(false));
      return rejectWithValue("Failed to load goals from localStorage");
    }
  }
);

// Async thunk to save a goal
export const saveGoal = createAsyncThunk(
  'goals/saveGoal',
  async (goalData: Omit<InvestmentGoal, "id">, { dispatch, rejectWithValue }) => {
    try {
      // Validate the goal data
      const validatedGoal = InvestmentGoalSchema.omit({ id: true }).parse(goalData);
      
      const newGoal: InvestmentGoal = {
        id: uuidv4(),
        ...validatedGoal,
      };
      
      // Convert to serializable format for Redux
      const serializableGoal = toSerializableInvestmentGoal(newGoal);
      
      // Save to localStorage
      const goals = parseGoalsFromStorage();
      goals.push(serializableGoal);
      localStorage.setItem("investment-tracker-goals", JSON.stringify(goals));
      
      // Update the store
      dispatch(addGoal(serializableGoal));
      
      return newGoal;
    } catch (error) {
      dispatch(setError("Failed to validate goal data"));
      return rejectWithValue("Failed to validate goal data");
    }
  }
);

// Async thunk to update a goal
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, updatedGoal }: { id: string; updatedGoal: Partial<InvestmentGoal> }, { dispatch, rejectWithValue }) => {
    try {
      // Update in localStorage
      const goals = parseGoalsFromStorage();
      const index = goals.findIndex((goal: SerializableInvestmentGoal) => goal.id === id);
      
      if (index !== -1) {
        // Ensure goals[index] exists before accessing its properties
        if (goals[index]) {
          // Convert the existing goal to InvestmentGoal for merging
          const existingGoal = fromSerializableInvestmentGoal(goals[index]);
          
          // Merge the updated goal data with the existing goal
          const mergedGoal: InvestmentGoal = {
            ...existingGoal,
            ...updatedGoal,
            id: existingGoal.id, // Ensure id is preserved
          };
          
          // Convert back to serializable format
          const serializableGoal = toSerializableInvestmentGoal(mergedGoal);
          
          goals[index] = serializableGoal;
        }
        localStorage.setItem("investment-tracker-goals", JSON.stringify(goals));
        
        // Update the store
        dispatch(updateGoalLocal({ id, updatedGoal: toSerializableInvestmentGoal({
          ...fromSerializableInvestmentGoal(goals[index]!),
          ...updatedGoal
        }) }));
        
        // Convert the updated goal back to InvestmentGoal for the return value
        const updatedGoalObj = fromSerializableInvestmentGoal(goals[index]!);
        return { id, updatedGoal: updatedGoalObj };
      }
      
      dispatch(setError("Goal not found"));
      return rejectWithValue("Goal not found");
    } catch (error) {
      dispatch(setError("Failed to update goal"));
      return rejectWithValue("Failed to update goal");
    }
  }
);

// Async thunk to delete a goal
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      // Delete from localStorage
      const goals = parseGoalsFromStorage();
      const initialLength = goals.length;
      const filteredGoals = goals.filter((goal: SerializableInvestmentGoal) => goal.id !== id);
      
      if (filteredGoals.length === initialLength) {
        dispatch(setError("Goal not found"));
        return rejectWithValue("Goal not found");
      }
      
      localStorage.setItem("investment-tracker-goals", JSON.stringify(filteredGoals));
      
      // Update the store
      dispatch(removeGoal(id));
      
      return id;
    } catch (error) {
      dispatch(setError("Failed to delete goal"));
      return rejectWithValue("Failed to delete goal");
    }
  }
);