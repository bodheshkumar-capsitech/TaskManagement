import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Taskbyprojectstats } from "../../types/Dashboard/TaskbyProjectstats";

interface taskbyprojectState {
    taskstats: Taskbyprojectstats[];
    loading: boolean;
    error: string;
}

const initialState: taskbyprojectState = {
    taskstats: [],
    loading: false,
    error: "",
};

const taskbyprojectstatSlice = createSlice({
    name: "dashboard",

    initialState,

    reducers: {

        setTaskStats: (
            state,
            action: PayloadAction<Taskbyprojectstats[]>
        ) => {
            state.taskstats = action.payload;
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

        clearTaskStats: (state) => {
            state.taskstats = [];
            state.error = "";
        },
    },
});

export const {
    setTaskStats,
    setDashboardLoading,
    setDashboardError,
    clearTaskStats,
} = taskbyprojectstatSlice.actions;

export default taskbyprojectstatSlice.reducer;