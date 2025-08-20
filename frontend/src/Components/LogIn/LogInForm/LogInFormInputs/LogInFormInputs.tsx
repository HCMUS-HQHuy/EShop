import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "src/Features/formsSlice.tsx";
import ShowHidePassword from "../../../Shared/MiniComponents/ShowHidePassword/ShowHidePassword.jsx";
import s from "./LogInFormInputs.module.scss";
import type { RootState } from "src/Types/store.ts";
import type { FormState } from "src/Types/forms.ts";


const LogInFormInputs = () => {
  const { email, password } = useSelector((state: RootState) => state.forms.login);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function updateInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      updateInput({
        formName: "login",
        key: e.target.name as keyof FormState["login"],
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
    </div>
  );
};
export default LogInFormInputs;
