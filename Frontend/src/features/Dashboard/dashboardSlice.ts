import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DashboardStats } from "../../types/Dashboard/DashboardStats";

interface DashboardState {
  stats: DashboardStats;

  loading: boolean;
  error: string;
}

const initialState: DashboardState = {
  stats: {
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  },

  loading: false,
  error: "",
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {
    setDashboardStats: (
      state,
      action: PayloadAction<DashboardStats>
    ) => {
      state.stats = action.payload;
    },

    setDashboardLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },

    setDashboardError: (
      state,
      action: PayloadAction<string>
    ) => {
      state.error = action.payload;
    },

    clearDashboardStats: (state) => {
      state.stats = {
        totalProjects: 0,
        activeProjects: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
      };

      state.error = "";
    },
  },
});

export const {
  setDashboardStats,
  setDashboardLoading,
  setDashboardError,
  clearDashboardStats,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;