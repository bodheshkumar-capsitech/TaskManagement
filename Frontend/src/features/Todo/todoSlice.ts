import { createSlice } from "@reduxjs/toolkit";
import type { Todo } from "../../types/Todo";

interface TodoState {
    todos: Todo[];
    loading: boolean;
    error: string | null;
    page: number;
    total: number;
    month:number;
    year:number;
    date:Date | null;
}

const initialState : TodoState =
{
    todos: [],
    loading: false,
    error: null,
    page: 1,
    total: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    date:null
}

const todoSlice = createSlice({
    name: "todo",

    initialState,

    reducers: {

        setTodos(state, action) {
            state.todos = action.payload;
        },

        addTodoRedux(state, action) {
            state.todos.unshift(action.payload);
        },

        deleteTodoRedux(state, action) {
            state.todos = state.todos.filter(
                todo => todo.id !== action.payload
            );
        },

        toggleTodoRedux(state, action) {
            const todo = state.todos.find(
                todo => todo.id === action.payload
            );

            if (todo) {
                todo.completed = !todo.completed;
            }
        },

        updateTodoRedux(state, action) {
            const index = state.todos.findIndex(
                todo => todo.id === action.payload.id
            );

            if (index !== -1) {
                state.todos[index] = action.payload;
            }
        },

        setPage(state, action) {
            state.page = action.payload;
        },

        setTotal(state, action) {
            state.total = action.payload;
        },

        setMonth(state,action)
        {
            state.month = action.payload;
        },

        setYear(state,action)
        {
            state.year = action.payload;
        },

        setDate(state,action)
        {
            state.date = action.payload;
        },

        setLoading(state, action) {
            state.loading = action.payload;
        },

        setError(state, action) {
            state.error = action.payload;
        }
    }
});

export const {
    setTodos,
    addTodoRedux,
    deleteTodoRedux,
    toggleTodoRedux,
    updateTodoRedux,
    setPage,
    setTotal,
    setMonth,
    setYear,
    setDate,
    setLoading,
    setError
} = todoSlice.actions;

export default todoSlice.reducer;