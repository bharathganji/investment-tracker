import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type SerializableInvestmentGoal } from "@/types";

// Define the initial state
interface GoalsState {
  goals: SerializableInvestmentGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    setGoals: (state, action: PayloadAction<SerializableInvestmentGoal[]>) => {
      state.goals = action.payload;
    },
    addGoal: (state, action: PayloadAction<SerializableInvestmentGoal>) => {
      state.goals.push(action.payload);
    },
    updateGoalLocal: (
      state,
      action: PayloadAction<{
        id: string;
        updatedGoal: Partial<SerializableInvestmentGoal>;
      }>,
    ) => {
      const index = state.goals.findIndex(
        (goal) => goal.id === action.payload.id,
      );
      if (index !== -1 && state.goals[index]) {
        // Create a new goal object with all required properties
        const updatedGoal: SerializableInvestmentGoal = {
          id: state.goals[index].id,
          name: action.payload.updatedGoal.name ?? state.goals[index].name,
          targetAmount:
            action.payload.updatedGoal.targetAmount ??
            state.goals[index].targetAmount,
          currentAmount:
            action.payload.updatedGoal.currentAmount ??
            state.goals[index].currentAmount,
          deadline:
            action.payload.updatedGoal.deadline ?? state.goals[index].deadline,
          progress:
            action.payload.updatedGoal.progress ?? state.goals[index].progress,
          assignedAssets:
            action.payload.updatedGoal.assignedAssets ??
            state.goals[index].assignedAssets,
        };
        state.goals[index] = updatedGoal;
      }
    },
    removeGoal: (state, action: PayloadAction<string>) => {
      state.goals = state.goals.filter((goal) => goal.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGoals,
  addGoal,
  updateGoalLocal,
  removeGoal,
  setLoading,
  setError,
} = goalsSlice.actions;

export default goalsSlice.reducer;
