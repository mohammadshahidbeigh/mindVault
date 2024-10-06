// src/store/userSlice.ts
import {createSlice, createAsyncThunk, PayloadAction} from "@reduxjs/toolkit";
import api from "../utils/axiosConfig";

interface UserState {
  isLoggedIn: boolean;
  userInfo: {
    email: string;
    name: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  userInfo: null,
  token: null,
  loading: false,
  error: null,
};

interface RegisterResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  "user/register",
  async (
    {name, email, password}: {name: string; email: string; password: string},
    {rejectWithValue}
  ) => {
    try {
      const response = await api.post("/graphql", {
        query: `
          mutation {
            register(name: "${name}", email: "${email}", password: "${password}") {
              token
              user {
                name
                email
              }
            }
          }
        `,
      });

      if (response.data.errors) {
        const errorMessage =
          response.data.errors[0]?.message || "Registration failed";
        return rejectWithValue(errorMessage);
      }

      return response.data.data.register as RegisterResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(`Registration failed: ${error.message}`);
      }
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: {data?: {errors?: {message: string}[]}};
        };
        const errorMessage =
          axiosError.response?.data?.errors?.[0]?.message ||
          "An unknown error occurred during registration";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("An unknown error occurred during registration");
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue}
  ) => {
    try {
      const response = await api.post("/graphql", {
        query: `
          mutation {
            login(email: "${email}", password: "${password}") {
              token
              user {
                name
                email
              }
            }
          }
        `,
      });
      return response.data.data.login as LoginResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    // Handle registration
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      registerUser.fulfilled,
      (state, action: PayloadAction<RegisterResponse>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      }
    );
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      loginUser.fulfilled,
      (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.userInfo = action.payload.user;
        state.token = action.payload.token;
      }
    );
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {logout} = userSlice.actions;
export default userSlice.reducer;
