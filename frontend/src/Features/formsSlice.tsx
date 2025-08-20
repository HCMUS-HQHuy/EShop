import { createSlice } from "@reduxjs/toolkit";
import type { FormKeys, FormState } from "src/Types/forms.ts";

const initialState: FormState= {
  signUp: {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  login: {
    email: "",
    password: "",
  },
  sellerRegistrationForm: {
    shopName: "",
    businessEmail: "",
    phoneNumber: "",
    shopDescription: "",
    address: "",
    agreeTerms: false,
  }
};

type actionPayLoad = {
  formName: keyof FormState;
  key: string;
  value: any;
};

const formSlice = createSlice({
  initialState,
  name: "formSlice",
  reducers: {
    updateInput: ( state: FormState, action: { payload: actionPayLoad } ) => {
      const { formName, key, value } = action.payload;
      (state[formName] as Record<string, any>)[key] = value;
    },
  },
});

export const { updateInput } = formSlice.actions;
export default formSlice.reducer;
