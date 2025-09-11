import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { setLoginData } from "src/ReduxSlice/userSlice.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";

import s from "./ResetPasswordForm.module.scss";
import LogInFormInputs from "./ResetPasswordFormInputs/ResetPasswordFormInputs.tsx";
import AuthSchemas from 'src/Types/forms.ts';
import type { RootState, AppDispatch } from "src/Types/store.ts";
import type { ResetPasswordFormValues } from "src/Types/forms.ts";
import type { TFunction } from "i18next";
import api from "src/Api/index.api.ts";

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const { password, confirmedPassword } = useSelector((state: RootState) => state.forms.resetPassword);
  const isWebsiteOnline = useOnlineStatus();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();

  async function ResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isWebsiteOnline) {
      internetConnectionAlert(dispatch, t);
      return;
    }
    const token: string = searchParams.get('token') || '';
    const result = AuthSchemas.resetPassword.safeParse({
      password: password,
      confirmedPassword: confirmedPassword
    });
    if (!result.success) {
      console.log("Invalid reset password credentials");
      return;
    }
    const credentials: ResetPasswordFormValues = result.data;
    try {
      await api.user.resetPassword(credentials);
      navigate("/");
    } catch (error) {
      console.error("Reset password request failed:", error);
      internetConnectionAlert(dispatch, t);
    }
  }

  return (
    <form className={s.form} onSubmit={ResetPassword}>
      <h2>{t("resetPasswordPage.title")}</h2>
      <p>{t("resetPasswordPage.description")}</p>

      <LogInFormInputs />

      <div className={s.buttons}>
        <button type="submit" className={s.loginBtn}>
          {t("buttons.resetPassword")}
        </button>
        {/* <a href="#">{t("loginSignUpPage.forgotPassword")}</a> */}
      </div>

      {/* <p className={s.signUpMessage}>
        <span>{t("loginSignUpPage.dontHaveAcc")}</span>
        <Link to="/signup">{t("nav.signUp")}</Link>
      </p> */}
    </form>
  );
};
export default ResetPasswordForm;

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
