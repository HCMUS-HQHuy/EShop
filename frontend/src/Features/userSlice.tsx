import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../Api/index.api.ts";
import type { LoginFormValues, RegisterFormValues, LoginInforValues } from "src/Types/forms.ts";

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

export const newSignUp = createAsyncThunk(
  "user/newSignUp",
  async (userInfor: RegisterFormValues, { rejectWithValue }) => {
    try {
      const response = await api.user.signUp(userInfor);
      return response;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const signOut = createAsyncThunk (
  "user/signOut",
  async () => {
    const response = await api.user.logout();
    return response;
  }
);

export const setLoginData = createAsyncThunk(
  "user/getLoginData",
  async () => {
    const response = await api.user.getInfor();
    return response.data.userInfor;
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
    builder.addCase(newSignUp.fulfilled, (state, action) => {
      state.status = 'idle';
      console.log("User signed up:", action.payload);
    });
    builder.addCase(newSignUp.pending, (state) => {
      state.status = 'pending';
      console.log("Signing up user...");
    });
    builder.addCase(newSignUp.rejected, (state, action) => {
      state.status = 'idle';
      console.error("User sign up failed:", action.payload);
    });

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
