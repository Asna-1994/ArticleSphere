import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../Interfaces/interfaces";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,

  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLogin: (state, action: PayloadAction<any>) => {
      (state.user = action.payload.user), (state.isAuthenticated = true);
    },
    updateUser: (state, action: PayloadAction<any>) => {
      console.log(action.payload.user);
      state.user = action.payload.user;
    },
    logOut: (state) => {
      (state.user = null), (state.isAuthenticated = false);
    },
  },
});
export const { userLogin, logOut, updateUser } = authSlice.actions;

export default authSlice.reducer;
