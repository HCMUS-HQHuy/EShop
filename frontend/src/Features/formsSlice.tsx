import { createSlice } from "@reduxjs/toolkit";
import type { FormKeys, FormState } from "Types/forms.ts";

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
  }
};

type UpdateInputPayload<K extends FormKeys = FormKeys> = {
  formName: K;
  key: keyof FormState[K];
  value: FormState[K][keyof FormState[K]];
};

const formSlice = createSlice({
  initialState,
  name: "formSlice",
  reducers: {
    updateInput: <K extends FormKeys>(state: FormState, action: { payload: UpdateInputPayload<K> }) => {
      const { formName, key, value } = action.payload;
      state[formName][key] = value;
    },
  },
});

export const { updateInput } = formSlice.actions;
export default formSlice.reducer;
