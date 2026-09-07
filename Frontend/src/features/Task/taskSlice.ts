import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProjectWithTask } from "../../types/Task/ProjectWithTask";

interface TaskState {
  taskData: ProjectWithTask;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  taskData: {
    totalcount: 0,
    taskList: [],
  },
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (
      state,
      action: PayloadAction<ProjectWithTask>
    ) => {
      state.taskData = action.payload;
      state.loading = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearTasks: (state) => {
      state.taskData = {
        totalcount: 0,
        taskList: [],
      };
      state.error = null;
    },
  },
});

export const {
  setTasks,
  setLoading,
  setError,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;