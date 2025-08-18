import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "Features/alertsSlice.jsx";
import { newSignUp, setLoginData } from "Features/userSlice.tsx";
import { registerValidationCheck } from "Functions/validation.js";
import useOnlineStatus from "Hooks/Helper/useOnlineStatus.jsx";
import SignUpButtons from "./SignUpButtons/SignUpButtons.tsx";
import s from "./SignUpForm.module.scss";
import SignUpFormInputs from "./SignUpFormInputs/SignUpFormInputs.tsx";
import type { TFunction } from "i18next";
import AuthSchemas, { type RegisterFormValues } from 'Types/credentials.ts';
import type { AppDispatch, RootState } from 'Types/store.ts'

const SignUpForm = () => {
  const { username, emailOrPhone, password, confirmPassword } 
      = useSelector((state: RootState) => state.forms.signUp);
  const isWebsiteOnline = useOnlineStatus();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }
    const result = AuthSchemas.register.safeParse({
      username: username,
      email: emailOrPhone,
      password: password,
      confirmPassword: confirmPassword
    });
    if (!result.success) {
      console.log("Invalid registration credentials");
      return;
    }
    const formData: RegisterFormValues = result.data;
    const { meta } = await dispatch(newSignUp(formData));
    const requestStatus = meta.requestStatus;
    if (requestStatus === "fulfilled") {
      signInAlert(t, dispatch);
    } else {
      internetConnectionAlert(dispatch, t);
    }
  }

  return (
    <form action="POST" className={s.form} onSubmit={signUp}>
      <h2>{t("loginSignUpPage.createAccount")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <SignUpFormInputs />
      <SignUpButtons />
    </form>
  );
};
export default SignUpForm;

export function signInAlert(t: TFunction, dispatch: AppDispatch) {
  const alertText = t("toastAlert.signInSuccess");
  const alertState = "success";

  setTimeout(() => {
    dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
  }, 1500);
}

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.signInFailed");
  const alertState = "error";

  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}