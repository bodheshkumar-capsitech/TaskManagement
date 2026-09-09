import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
    firstname: string;
    email: string;
    role: string;
    isLoggedIn: boolean;
}

const initialState: ProfileState = {
    firstname: "",
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
                firstname: string;
                email: string;
                role: string;
            }>
        ) => {
            state.firstname = action.payload.firstname;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.isLoggedIn = true;
        },


        setaFirstname: (
            state,
            action: PayloadAction<string>
        ) => {
            state.firstname = action.payload;
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
            state.firstname = "";
            state.email = "";
            state.role = "";
            state.isLoggedIn = false;
        },

        clearAuth: (
            state
        ) => {
            state.firstname = "";
            state.email = "";
            state.role = "";
            state.isLoggedIn = false;
        },
    },
});


export const {
    setLoginData,
    setaFirstname,
    setEmail,
    setRole,
    setIsLoggedIn,
    logoutRedux,
    clearAuth,
} = ProfileSlice.actions;


export default ProfileSlice.reducer;