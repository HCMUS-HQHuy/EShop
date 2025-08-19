import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Type cho form con
type SignUpForm = {
  username: string;
  emailOrPhone: string;
  password: string;
  confirmPassword: string;
};

type LoginForm = {
  emailOrPhone: string;
  password: string;
};

// Tổng thể state của slice
interface FormState {
  signUp: SignUpForm;
  login: LoginForm;
}

// Initial state
const initialState: FormState = {
  signUp: {
    username: "",
    emailOrPhone: "",
    password: "",
    confirmPassword: "",
  },
  login: {
    emailOrPhone: "",
    password: "",
  },
};

interface UpdateInputPayload {
  formName: keyof FormState; // 'signUp' | 'login'
  key: string;
  value: string;
}

// Slice
const formSlice = createSlice({
  name: "formSlice",
  initialState,
  reducers: {
    updateInput: (state, action: PayloadAction<UpdateInputPayload>) => {
      const { formName, key, value } = action.payload;
      if (key in state[formName]) {
        (state[formName] as any)[key] = value;
      }
    },
  },
});

// Export
export const { updateInput } = formSlice.actions;
export default formSlice.reducer;
