import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { newSignUp, setLoginData } from "src/ReduxSlice/userSlice.tsx";
import { registerValidationCheck } from "src/Functions/validation.ts";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import SignUpButtons from "./SignUpButtons/SignUpButtons.tsx";
import s from "./SignUpForm.module.scss";
import SignUpFormInputs from "./SignUpFormInputs/SignUpFormInputs.tsx";
import type { TFunction } from "i18next";
import AuthSchemas, { type RegisterFormValues } from 'src/Types/forms.ts';
import type { AppDispatch, RootState } from 'src/Types/store.ts'
import api from "src/Api/index.api.ts";
import { ALERT_STATE } from "src/Types/common.ts";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const { username, email, password, confirmPassword } 
      = useSelector((state: RootState) => state.forms.signUp);
  const isWebsiteOnline = useOnlineStatus();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }
    const result = AuthSchemas.register.safeParse({
      username: username,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    });
    if (!result.success) {
      dispatch(showAlert({ alertText: "Invalid registration credentials", alertState: ALERT_STATE.ERROR, alertType: "alert" }));
      return;
    }
    const formData: RegisterFormValues = result.data;
    try {
      formSubmitted(t, dispatch);
      await api.user.signUp(formData);
      signInAlert(t, dispatch);
      navigate("/login");
    } catch (error) {
      const errorResponse = (error as any)?.data;
      if (errorResponse?.username) {
        errorAlert(dispatch, errorResponse.username);
      }
      if (errorResponse?.email) {
        errorAlert(dispatch, errorResponse.email);
      }
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
  setTimeout(() => {
    dispatch(showAlert({ alertText, alertState: ALERT_STATE.SUCCESS, alertType: "alert" }));
  }, 1500);
}

export function formSubmitted(t: TFunction, dispatch: AppDispatch) {
  const alertText = t("toastAlert.formSubmitted");
  setTimeout(() => {
    dispatch(showAlert({ alertText, alertState: ALERT_STATE.SUCCESS, alertType: "alert" }));
  }, 1500);
}

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.signInFailed");
  dispatch(showAlert({ alertText, alertState: ALERT_STATE.ERROR, alertType: "alert" }));
}

function errorAlert(dispatch: AppDispatch, alertText: string) {
  dispatch(showAlert({ alertText, alertState: ALERT_STATE.ERROR, alertType: "alert" }));
}