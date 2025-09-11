import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";

import s from "./ForgotPasswordForm.module.scss";
import LogInFormInputs from "./ForgotPasswordFormInputs/ForgotPasswordFormInputs.tsx";
import AuthSchemas from 'src/Types/forms.ts';
import type { RootState, AppDispatch } from "src/Types/store.ts";
import type { ForgotPasswordFormValues, LoginFormValues } from "src/Types/forms.ts";
import type { TFunction } from "i18next";
import api from "src/Api/index.api.ts";
import { useRef } from "react";
import { updateInput } from "src/ReduxSlice/formsSlice.tsx";

const ResetPasswordForm = () => {
  const { email } = useSelector((state: RootState) => state.forms.forgotPassword);
  const isWebsiteOnline = useOnlineStatus();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const isSending = useRef<boolean>(false);
  const navigate = useNavigate();

  async function forgotPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }
    if (isSending.current) {
      dispatch(showAlert({ alertText: 'Request is already being sent', alertState: "warning", alertType: "alert" }));
      return;
    }
    const result = AuthSchemas.forgotPassword.safeParse({
      email: email
    });
    if (!result.success) {
      console.log("Invalid login credentials");
      return;
    }
    const credentials: ForgotPasswordFormValues = result.data;
    try {
      isSending.current = true;
      dispatch(showAlert({ alertText: 'Sent Request', alertState: "success", alertType: "alert" }));
      const response = await api.user.forgotPassword(credentials);
      const details = response.data;
      console.log("Login data set:", details);
      dispatch(updateInput({key: "email", formName: "login", value: email}));
      navigate(details.redirectUrl);
      dispatch(showAlert({ alertText: 'Password reset email sent, please check your inbox', alertState: "success", alertType: "alert" }));
    } catch (error) {
      console.error("Forgot password request failed:", error);
      internetConnectionAlert(dispatch, t);
    } finally {
      isSending.current = false;
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
      </div>
    </form>
  );
};
export default ResetPasswordForm;

function internetConnectionAlert(dispatch: AppDispatch, t: TFunction) {
  const alertText = t("toastAlert.loginFailed");
  const alertState = "error";

  dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
}
