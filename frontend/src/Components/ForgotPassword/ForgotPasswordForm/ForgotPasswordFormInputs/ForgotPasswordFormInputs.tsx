import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "src/Features/formsSlice.tsx";
import s from "./ForgotPasswordFormInputs.module.scss";
import type { RootState } from "src/Types/store.ts";
import type { FormState } from "src/Types/forms.ts";

const ResetPasswordFormInputs = () => {
  const { email } = useSelector((state: RootState) => state.forms.forgotPassword);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function updateInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      updateInput({
        formName: "forgotPassword",
        key: e.target.name as keyof FormState["forgotPassword"],
        value: e.target.value,
      })
    );
  }

  return (
    <div className={s.inputs}>
      <input
        type="text"
        name="email"
        value={email}
        placeholder={t("inputsPlaceholders.email")}
        onChange={updateInputOnChange}
        aria-required="false"
      />
    </div>
  );
};
export default ResetPasswordFormInputs;
