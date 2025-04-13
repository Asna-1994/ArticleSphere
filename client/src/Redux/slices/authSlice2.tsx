import { createSlice } from "@reduxjs/toolkit";

let initialState ={
    user : {
        name : '',
        age : 20
    }
}

const authSlice = createSlice({
    name : 'auth',
    initialState,
    reducers : {
        useLogin : (state, action) => {

        }
    }
})

export const { useLogin} = authSlice.actions
export default authSlice.reducer