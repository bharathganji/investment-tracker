import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from "uuid";
import { type InvestmentGoal } from '@/types';
import { InvestmentGoalSchema } from '@/types/schemas';

// Helper function to safely parse goals from localStorage
const parseGoalsFromStorage = (): InvestmentGoal[] => {
  try {
    const goalsData = localStorage.getItem("investment-tracker-goals");
    if (!goalsData) return [];
    
    const goals: unknown = JSON.parse(goalsData);
    if (Array.isArray(goals)) {
      // Validate each goal and filter out invalid ones
      return goals.map((goal: unknown) => {
        if (typeof goal === "object" && goal !== null && "deadline" in goal) {
          // Validate that the goal has all required properties
          const validGoal = InvestmentGoalSchema.safeParse({
            ...(goal as object),
            deadline: new Date((goal as { deadline: string }).deadline),
          });
          
          if (validGoal.success) {
            return validGoal.data;
          }
        }
        return null;
      }).filter((goal): goal is InvestmentGoal => goal !== null);
    }
  } catch {
    // If parsing fails, return an empty array
  }
  return [];
};

// Define the initial state
interface GoalsState {
  goals: InvestmentGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

// Async thunk to load goals from localStorage
export const loadGoals = createAsyncThunk(
  'goals/loadGoals',
  async (_, { rejectWithValue }) => {
    try {
      return parseGoalsFromStorage();
    } catch {
      return rejectWithValue("Failed to load goals from localStorage");
    }
  }
);

// Async thunk to save a goal
export const saveGoal = createAsyncThunk(
  'goals/saveGoal',
  async (goalData: Omit<InvestmentGoal, "id">, { rejectWithValue }) => {
    try {
      // Validate the goal data
      const validatedGoal = InvestmentGoalSchema.omit({ id: true }).parse(goalData);
      
      const newGoal: InvestmentGoal = {
        id: uuidv4(),
        ...validatedGoal,
      };
      
      // Save to localStorage
      const goals = parseGoalsFromStorage();
      goals.push(newGoal);
      localStorage.setItem("investment-tracker-goals", JSON.stringify(goals));
      
      return newGoal;
    } catch {
      return rejectWithValue("Failed to validate goal data");
    }
  }
);

// Async thunk to update a goal
export const updateGoal = createAsyncThunk(
  'goals/updateGoal',
  async ({ id, updatedGoal }: { id: string; updatedGoal: Partial<InvestmentGoal> }, { rejectWithValue }) => {
    try {
      // Update in localStorage
      const goals = parseGoalsFromStorage();
      const index = goals.findIndex((goal: InvestmentGoal) => goal.id === id);
      
      if (index !== -1) {
        // Ensure goals[index] exists before accessing its properties
        if (goals[index]) {
          goals[index] = {
            ...goals[index],
            ...updatedGoal,
            id: goals[index].id, // Ensure id is preserved
            deadline: updatedGoal.deadline ?? goals[index].deadline // Ensure deadline is preserved
          };
        }
        localStorage.setItem("investment-tracker-goals", JSON.stringify(goals));
        return { id, updatedGoal };
      }
      
      return rejectWithValue("Goal not found");
    } catch {
      return rejectWithValue("Failed to update goal");
    }
 }
);

// Async thunk to delete a goal
export const deleteGoal = createAsyncThunk(
  'goals/deleteGoal',
  async (id: string, { rejectWithValue }) => {
    try {
      // Delete from localStorage
      const goals = parseGoalsFromStorage();
      const initialLength = goals.length;
      const filteredGoals = goals.filter((goal: InvestmentGoal) => goal.id !== id);
      
      if (filteredGoals.length === initialLength) {
        return rejectWithValue("Goal not found");
      }
      
      localStorage.setItem("investment-tracker-goals", JSON.stringify(filteredGoals));
      return id;
    } catch {
      return rejectWithValue("Failed to delete goal");
    }
  }
);

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<InvestmentGoal[]>) => {
      state.goals = action.payload;
    },
    addGoal: (state, action: PayloadAction<InvestmentGoal>) => {
      state.goals.push(action.payload);
    },
    updateGoalLocal: (state, action: PayloadAction<{ id: string; updatedGoal: Partial<InvestmentGoal> }>) => {
      const index = state.goals.findIndex((goal) => goal.id === action.payload.id);
      if (index !== -1 && state.goals[index]) {
        // Create a new goal object with all required properties
        const updatedGoal: InvestmentGoal = {
          id: state.goals[index].id,
          name: action.payload.updatedGoal.name ?? state.goals[index].name,
          targetAmount: action.payload.updatedGoal.targetAmount ?? state.goals[index].targetAmount,
          currentAmount: action.payload.updatedGoal.currentAmount ?? state.goals[index].currentAmount,
          deadline: action.payload.updatedGoal.deadline ?? state.goals[index].deadline,
          progress: action.payload.updatedGoal.progress ?? state.goals[index].progress,
          assignedAssets: action.payload.updatedGoal.assignedAssets ?? state.goals[index].assignedAssets,
        };
        state.goals[index] = updatedGoal;
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Load goals
      .addCase(loadGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadGoals.fulfilled, (state, action: PayloadAction<InvestmentGoal[]>) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(loadGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to load goals";
      })
      // Save goal
      .addCase(saveGoal.fulfilled, (state, action: PayloadAction<InvestmentGoal>) => {
        state.goals.push(action.payload);
      })
      .addCase(saveGoal.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to save goal";
      })
      // Update goal
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<{ id: string; updatedGoal: Partial<InvestmentGoal> }>) => {
        const { id, updatedGoal } = action.payload;
        const index = state.goals.findIndex((goal) => goal.id === id);
        if (index !== -1 && state.goals[index]) {
          // Create a new goal object with all required properties
          const newGoal: InvestmentGoal = {
            id: state.goals[index].id,
            name: updatedGoal.name ?? state.goals[index].name,
            targetAmount: updatedGoal.targetAmount ?? state.goals[index].targetAmount,
            currentAmount: updatedGoal.currentAmount ?? state.goals[index].currentAmount,
            deadline: updatedGoal.deadline ?? state.goals[index].deadline,
            progress: updatedGoal.progress ?? state.goals[index].progress,
            assignedAssets: updatedGoal.assignedAssets ?? state.goals[index].assignedAssets,
          };
          state.goals[index] = newGoal;
        }
      })
      .addCase(updateGoal.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to update goal";
      })
      // Delete goal
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.goals = state.goals.filter((goal) => goal.id !== action.payload);
      })
      .addCase(deleteGoal.rejected, (state, action) => {
        state.error = action.payload as string || "Failed to delete goal";
      });
  },
});

export const { setGoals, addGoal, updateGoalLocal, removeGoal } = goalsSlice.actions;

export default goalsSlice.reducer;