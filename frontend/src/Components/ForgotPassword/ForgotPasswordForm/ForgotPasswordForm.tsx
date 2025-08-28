import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { loginUser, setLoginData } from "src/Features/userSlice.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";

import s from "./ForgotPasswordForm.module.scss";
import LogInFormInputs from "./ForgotPasswordFormInputs/ForgotPasswordFormInputs.tsx";
import AuthSchemas from 'src/Types/forms.ts';
import type { RootState, AppDispatch } from "src/Types/store.ts";
import type { ForgotPasswordFormValues, LoginFormValues } from "src/Types/forms.ts";
import type { TFunction } from "i18next";
import api from "src/Api/index.api.ts";

const ResetPasswordForm = () => {
  const { email } = useSelector((state: RootState) => state.forms.forgotPassword);
  const isWebsiteOnline = useOnlineStatus();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  async function forgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }
    console.log(email);
    const result = AuthSchemas.forgotPassword.safeParse({
      email: email
    });
    if (!result.success) {
      console.log("Invalid login credentials");
      return;
    }
    const credentials: ForgotPasswordFormValues = result.data;
    try {
      const response = await api.user.forgotPassword(credentials);
      console.log("Login data set:", response);
      dispatch(showAlert({ alertText: 'Sent Request', alertState: "success", alertType: "alert" }));
    } catch (error) {
      console.error("Forgot password request failed:", error);
      internetConnectionAlert(dispatch, t);
    }
  }

  return (
    <form className={s.form} onSubmit={forgotPassword}>
      <h2>{t("forgotPasswordPage.title")}</h2>
      <p>{t("forgotPasswordPage.description")}</p>

      <LogInFormInputs />

      <div className={s.buttons}>
        <button type="submit" className={s.loginBtn}>
          {t("buttons.send")}
        </button>
        <Link to="/login">{t("forgotPasswordPage.cancel")}</Link>
      </div>

      <p className={s.signUpMessage}>
        <span>{t("loginSignUpPage.dontHaveAcc")}</span>
        <Link to="/signup">{t("nav.signUp")}</Link>
      </p>
    </form>
  );
};
export default ResetPasswordForm;

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.loginFailed");
  const alertState = "error";

  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}
