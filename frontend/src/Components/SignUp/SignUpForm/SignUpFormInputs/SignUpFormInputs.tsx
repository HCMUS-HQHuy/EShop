import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateInput } from "Features/formsSlice.tsx";
import ShowHidePassword from "Components/Shared/MiniComponents/ShowHidePassword/ShowHidePassword.jsx";
import s from "./SignUpFormInputs.module.scss";
import type { RootState } from "Types/store.ts";

const SignUpFormInputs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { username, email, password, confirmPassword } = useSelector(
    (state: RootState) => state.forms.signUp
  );

  function updateInputOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(
      updateInput({
        formName: "signUp",
        key: e.target.name,
        value: e.target.value,
      })
    );
  }

  return (
    <div className={s.inputs}>
      <input
        type="text"
        name="username"
        value={username}
        placeholder={t("inputsPlaceholders.username")}
        onChange={updateInputOnChange}
        required
        aria-required="true"
      />
      <input
        type="text"
        name="email"
        value={email}
        placeholder={t("inputsPlaceholders.email")} // update to email or phone later
        onChange={updateInputOnChange}
        required
        aria-required="true"
      />
      <div className={s.input}>
        <input
          type="password"
          name="password"
          value={password}
          placeholder={t("inputsPlaceholders.password")}
          onChange={updateInputOnChange}
          required
          aria-required="true"
        />
        <ShowHidePassword />
      </div>
      <div className={s.input}>
        <input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          placeholder={t("inputsPlaceholders.confirmPass")}
          onChange={updateInputOnChange}
          required
          aria-required="true"
        />
        <ShowHidePassword />
      </div>
      
    </div>
  );
};
export default SignUpFormInputs;
