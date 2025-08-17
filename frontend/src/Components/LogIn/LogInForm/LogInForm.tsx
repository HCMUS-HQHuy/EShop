import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showAlert } from "Features/alertsSlice.jsx";
import { loginUser, setLoginData } from "Features/userSlice.tsx";
import { simpleValidationCheck } from "Functions/validation.js";
import useOnlineStatus from "Hooks/Helper/useOnlineStatus.jsx";

import s from "./LogInForm.module.scss";
import LogInFormInputs from "./LogInFormInputs/LogInFormInputs.tsx";
import type { RootState, AppDispatch } from "Types/store.ts";
import type { Credentials } from "Types/credentials.ts";
import type { TFunction } from "i18next";

const LogInForm = () => {
  const { emailOrPhone, password } = useSelector((state: RootState) => state.forms.login);
  const isWebsiteOnline = useOnlineStatus();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  async function login(e: React.FormEvent<HTMLFormElement>) {
    const inputs = e.currentTarget.querySelectorAll("input");
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }

    const isFormValid = simpleValidationCheck(inputs);
    if (!isFormValid) {
      console.log("Form validation failed");
      return;
    }
    const credentials: Credentials = {
      email: emailOrPhone,
      password: password
    };
    await dispatch(loginUser(credentials));
    // console.log("promise", promise);
    const response = await dispatch(setLoginData());
    console.log("Login data set:", response);
    logInAlert(dispatch, t);
  }

  return (
    <form className={s.form} onSubmit={login}>
      <h2>{t("loginSignUpPage.login")}</h2>
      <p>{t("loginSignUpPage.enterDetails")}</p>

      <LogInFormInputs />

      <div className={s.buttons}>
        <button type="submit" className={s.loginBtn}>
          {t("buttons.login")}
        </button>
        <a href="#">{t("loginSignUpPage.forgotPassword")}</a>
      </div>

      <p className={s.signUpMessage}>
        <span>{t("loginSignUpPage.dontHaveAcc")}</span>
        <Link to="/signup">{t("nav.signUp")}</Link>
      </p>
    </form>
  );
};
export default LogInForm;

function logInAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.loginSuccess");
  const alertState = "success";

  setTimeout(
    () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
    1500
  );
}

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.loginFailed");
  const alertState = "error";

  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}
