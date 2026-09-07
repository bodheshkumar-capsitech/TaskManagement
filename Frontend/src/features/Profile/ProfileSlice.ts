import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
    username: string;
    email: string;
    role: string;
    isLoggedIn: boolean;
}

const initialState: ProfileState = {
    username: "",
    email: "",
    role: "",
    isLoggedIn: false,
};

const ProfileSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setLoginData: (
            state,
            action: PayloadAction<{
                username: string;
                email: string;
                role: string;
            }>
        ) => {
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isLoggedIn = true;
        },


        setUsername: (
            state,
            action: PayloadAction<string>
        ) => {
            state.username = action.payload;
        },


        setEmail: (
            state,
            action: PayloadAction<string>
        ) => {
            state.email = action.payload;
        },


        setRole: (
            state,
            action: PayloadAction<string>
        ) => {
            state.role = action.payload;
        },


        setIsLoggedIn: (
            state,
            action: PayloadAction<boolean>
        ) => {
            state.isLoggedIn = action.payload;
        },


        logoutRedux: (
            state
        ) => {
            state.username = "";
            state.email = "";
            state.role = "";
            state.isLoggedIn = false;
        },

        clearAuth: (
            state
        ) => {
            state.username = "";
            state.email = "";
            state.role = "";
            state.isLoggedIn = false;
        },
    },
});


export const {
    setLoginData,
    setUsername,
    setEmail,
    setRole,
    setIsLoggedIn,
    logoutRedux,
    clearAuth,
} = ProfileSlice.actions;


export default ProfileSlice.reducer;