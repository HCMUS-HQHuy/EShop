import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/index.api.ts";
import type { LoginFormValues, LoginInforValues } from "../types/credentials.ts";

const initialState = {
  loginInfo: {
    username: "",
    email: "",
    address: "",
    phoneNumber: "",
    isSignIn: false,
  },
  status: 'idle'
}

export const loginAdmin = createAsyncThunk(
  "user/login",
  async (credentials: LoginFormValues) => {
    const response = await api.user.login(credentials);
    return response.data;
  }
);

export const signOut = createAsyncThunk (
  "user/signOut",
  async () => {
    const response = await api.user.logout();
    return response.data;
  }
);

export const setLoginData = createAsyncThunk(
  "user/getLoginData",
  async () => {
    const response = await api.user.getInfor();
    return response.data;
  }
);

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    updateUserData: (state, { payload }) => {
      Object.assign(state.loginInfo, payload.updatedUserData);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.status = 'idle';
      console.log("User logged in:", action.payload);
    })
    builder.addCase(loginAdmin.pending, (state) => {
      state.status = 'pending';
      console.log("Logging in user...");
    })
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.status = 'idle';
      console.error("User login failed:", action.error);
    })

    builder.addCase(setLoginData.fulfilled, (state, action) => {
      state.loginInfo = { ...action.payload };
      state.loginInfo.isSignIn = true;
      console.log("User login info updated:", state.loginInfo);
    });
    builder.addCase(setLoginData.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(setLoginData.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Fetching user login data failed:", action.error);
    });

    builder.addCase(signOut.fulfilled, (state) => {
      const guestData: LoginInforValues = {
        username: "",
        email: "",
        address: "",
        phoneNumber: "",
        isSignIn: false,
      };
      state.loginInfo = guestData;
    });
    builder.addCase(signOut.pending, (state) => {
      state.status = 'pending';
      console.log("Signing out user...");
    });
    builder.addCase(signOut.rejected, (state, action) => {
      state.status = 'idle';
      console.error("User sign out failed:", action.error);
    });
  }
});

export const { updateUserData } =
  userSlice.actions;
export default userSlice.reducer;
