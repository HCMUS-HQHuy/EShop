import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "src/ReduxSlice/formsSlice.tsx";
import ShowHidePassword from "../../../Shared/MiniComponents/ShowHidePassword/ShowHidePassword.tsx";
import s from "./ResetPasswordFormInputs.module.scss";
import type { RootState } from "src/Types/store.ts";
import type { FormState } from "src/Types/forms.ts";


const ResetPasswordFormInputs = () => {
  const { password, confirmedPassword } = useSelector((state: RootState) => state.forms.resetPassword);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function updateInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      updateInput({
        formName: "resetPassword",
        key: e.target.name as keyof FormState["resetPassword"],
        value: e.target.value,
      })
    );
  }

  return (
    <div className={s.inputs}>
      <div className={s.input}>
        <input
          type="password"
          name="password"
          value={password}
          placeholder={t("inputsPlaceholders.password")}
          onChange={updateInputOnChange}
          aria-required="false"
        />
        <ShowHidePassword />
      </div>
    <div className={s.input}>
      <input
        type="password"
        name="confirmedPassword"
        value={confirmedPassword}
        placeholder={t("inputsPlaceholders.confirmPass")}
        onChange={updateInputOnChange}
        aria-required="false"
      />
      <ShowHidePassword />
    </div>
    </div>
  );
};
export default ResetPasswordFormInputs;
