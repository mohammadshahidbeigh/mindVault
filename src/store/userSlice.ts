// src/store/userSlice.ts
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    email: string;
    name: string;
  } | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{email: string; name: string}>) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const {login, logout} = userSlice.actions;
export default userSlice.reducer;
