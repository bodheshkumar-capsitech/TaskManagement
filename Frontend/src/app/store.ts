import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import todoReducer from "../features/Todo/todoSlice";
import projectReducer from "../features/Projects/projectSlice"
import profileReducer from "../features/Profile/ProfileSlice"
import dashboardReducer from "../features/Dashboard/dashboardSlice"
import taskbyprojectstatReducer from "../features/Dashboard/taskbyprojectstatSlice"
import taskReducer from "../features/Task/taskSlice"


export const store = configureStore({
    reducer: {
        auth: authReducer,
        todo: todoReducer,
        project: projectReducer,
        profile: profileReducer,
        dashboard: dashboardReducer,
        taskbyproject: taskbyprojectstatReducer,
        task:taskReducer
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;