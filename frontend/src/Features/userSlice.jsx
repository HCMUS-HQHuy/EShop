import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./../Api/index.api";

// const initialStateLocal = localStorage.getItem("userSliceData");

// const initialState = initialStateLocal
//   ? JSON.parse(initialStateLocal)
//   : {
//       loginInfo: {
//         username: "Lily Watson",
//         emailOrPhone: "lily.wastons@gmail.com",
//         password: "random-password1234",
//         address: "United State, California",
//         isSignIn: true,
//       },
//       signedUpUsers: [
//         {
//           username: "Lily Watson",
//           emailOrPhone: "lily.wastons@gmail.com",
//           password: "random-password1234",
//         },
//       ],
//     };

const initialState = {
  userInfor: {
    username: "",
    email: "",
    password: "",
    address: "",
    isSignIn: false,
  },
  loginInfo: {
    username: "",
    email: "",
    password: "",
    address: "",
    isSignIn: false,
  },
  status: 'idle'
}

export const newSignUp = createAsyncThunk(
  "user/newSignUp",
  async (userInfor) => {
    const response = await api.user.signUp(userInfor);
    return response.data;
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials) => {
    const response = await api.user.login(credentials);
    return response.data;
  }
);

export const signOut = createAsyncThunk (
  "user/signOut",
  async () => {

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
    // newSignUp: (state, { payload }) => {
    //   state.signedUpUsers = payload;
    //   state.loginInfo.isSignIn = true;
    // },
    // setLoginData: (state, { payload }) => {
    //   state.loginInfo = { ...payload };
    //   state.loginInfo.isSignIn = true;
    // },
    // signOut: (state) => {
    //   const guestData = {
    //     username: "",
    //     emailOrPhone: "",
    //     password: "",
    //   };
    //   state.loginInfo = guestData;
    //   state.loginInfo.isSignIn = false;
    // },
    updateUserData: (state, { payload }) => {
      Object.assign(state.loginInfo, payload.updatedUserData);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'idle';
      console.log("User logged in:", action.payload);
    })
    builder.addCase(loginUser.pending, (state) => {
      state.status = 'pending';
      console.log("Logging in user...");
    })
    builder.addCase(loginUser.rejected, (state, action) => {
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
      // console.log("Fetching user login data...");
    });
    builder.addCase(setLoginData.rejected, (state, action) => {
      state.status = 'idle';
      console.error("Fetching user login data failed:", action.error);
    });
  }
});

export const { updateUserData } =
  userSlice.actions;
export default userSlice.reducer;
