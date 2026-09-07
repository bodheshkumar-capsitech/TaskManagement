import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "../../types/Project/Project";
import type { Priority } from "../../types/Priority";
import { Task, type Taskvalues } from "../../types/Project/Taskvalues";


interface ProjectState {
    projects: Project[];

    name: string;
    description: string;

    priority: Priority;
    status: Taskvalues;

    editingId: string | null;

    loading: boolean;
    error: string;

    page: number;
    pageSize: number;
    total: number;

    year: number;
    month:number;
}

const initialState: ProjectState = {
    projects: [],

    name: "",
    description: "",

    priority: "Medium",
    status: Task.InProgress,
    editingId: null,

    loading: false,
    error: "",

    page: 1,
    pageSize: 30,
    total: 0,

    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
};


const projectSlice = createSlice({

    name: "project",

    initialState,

    reducers: {

        setProjects: (
            state,
            action: PayloadAction<Project[]>
        ) => {
            state.projects = action.payload;
        },


        addProject: (
            state,
            action: PayloadAction<Project>
        ) => {
            state.projects.unshift(action.payload);
        },


        updateProjectRedux: (
            state,
            action: PayloadAction<Project>
        ) => {

            const index = state.projects.findIndex(
                project =>
                    project.id === action.payload.id
            );

            if (index !== -1) {
                state.projects[index] = action.payload;
            }
        },


        deleteProjectRedux: (
            state,
            action: PayloadAction<string>
        ) => {

            state.projects = state.projects.filter(
                project =>
                    project.id !== action.payload
            );
        },


        setName: (
            state,
            action: PayloadAction<string>
        ) => {
            state.name = action.payload;
        },


        setDescription: (
            state,
            action: PayloadAction<string>
        ) => {
            state.description = action.payload;
        },


        setPriority: (
            state,
            action: PayloadAction<Priority>
        ) => {
            state.priority = action.payload;
        },


        setStatus: (
            state,
            action: PayloadAction<Taskvalues>
        ) => {
            state.status = action.payload;
        },


        setEditingId: (
            state,
            action: PayloadAction<string | null>
        ) => {
            state.editingId = action.payload;
        },


        setLoading: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.loading = action.payload;
        },


        setError: (
            state,
            action: PayloadAction<string>
        ) => {
            state.error = action.payload;
        },

        setPage: (
            state,
            action: PayloadAction<number>
        ) => {
            state.page = action.payload;
        },


        setPageSize: (
            state,
            action: PayloadAction<number>
        ) => {
            state.pageSize = action.payload;
        },


        setTotal: (
            state,
            action: PayloadAction<number>
        ) => {
            state.total = action.payload;
        },

        
        setYear: (
            state,
            action: PayloadAction<number>
        ) =>
        {
            state.year = action.payload;
        },

        setMonth: (
            state,
            action: PayloadAction<number>
        ) =>
        {
            state.month = action.payload;
        },

        clearForm: (
            state
        ) => {

            state.name = "";
            state.description = "";
            state.priority = "Medium"
            state.status = Task.InProgress;
            state.editingId = null;
            state.error = "";
        },


        editProject: (
            state,
            action: PayloadAction<Project>
        ) => {

            const project = action.payload;
            state.editingId = project.id;
            state.name = project.name;
            state.description = project.description;
            state.priority = project.priority;
            state.status = project.status;
            state.error = "";
        },

    },
});


export const {
    setProjects,
    addProject,
    updateProjectRedux,
    deleteProjectRedux,

    setName,
    setDescription,

    setPriority,
    setStatus,

    setEditingId,

    setLoading,
    setError,

    setPage,
    setPageSize,
    setTotal,

    setYear,
    setMonth,

    clearForm,
    editProject,

} = projectSlice.actions;


export default projectSlice.reducer;