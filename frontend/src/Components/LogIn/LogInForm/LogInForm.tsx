import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { setLoginData } from "src/ReduxSlice/userSlice.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";

import s from "./LogInForm.module.scss";
import LogInFormInputs from "./LogInFormInputs/LogInFormInputs.tsx";
import AuthSchemas from 'src/Types/forms.ts';
import type { RootState, AppDispatch } from "src/Types/store.ts";
import type { LoginFormValues } from "src/Types/forms.ts";
import type { TFunction } from "i18next";
import api from "src/Api/index.api.ts";
import { ALERT_STATE } from "src/Types/common.ts";

const LogInForm = () => {
  const { email, password } = useSelector((state: RootState) => state.forms.login);
  const isWebsiteOnline = useOnlineStatus();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  async function login(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }

    const result = AuthSchemas.login.safeParse({
      email: email,
      password: password
    });
    if (!result.success) {
      dispatch(showAlert({alertState: ALERT_STATE.ERROR, alertText: result.error.issues.toString(), alertType: "alert"}));
      return;
    }
    const credentials: LoginFormValues = result.data;
    try {
      await api.user.login(credentials);
      await dispatch(setLoginData());
      logInAlert(dispatch, t);
    } catch (error: any) {
      if (error.response) {
        dispatch(showAlert({alertState: ALERT_STATE.ERROR, alertText: error.response.data.message, alertType: "alert"}));
      }
      console.error("Failed to set login data:", error);
    }
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
        <Link to="/forgot-password">{t("loginSignUpPage.forgotPassword")}</Link>
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
  const alertState = ALERT_STATE.SUCCESS;

  setTimeout(
    () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
    1500
  );
}

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.loginFailed");
  const alertState = ALERT_STATE.ERROR;

  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}
