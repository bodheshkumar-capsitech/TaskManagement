import { createSlice } from "@reduxjs/toolkit";

interface Authstate
{
    isAuthenticated : boolean
}

const initialState:Authstate = 
{
    isAuthenticated : false
}


const authSlice = createSlice({
    name:"auth",

    initialState,

    reducers:{

        loginredux(state){
            state.isAuthenticated = true;
        },

        logoutredux(state){
            state.isAuthenticated = false;
        }

    }

});

export const {loginredux,logoutredux} = authSlice.actions;

export default authSlice.reducer;