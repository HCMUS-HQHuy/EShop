import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { updateUserData } from "src/Features/userSlice.tsx";
import {
  checkAreInputsValid,
  checkEmailValidation,
  checkEmptyInputs,
  checkPasswordInputs,
} from "src/Functions/validation.ts";
import OpenShopInputs from "./OpenShopInputs.tsx";
import ProfileFormButtons from "../ProfileFormButtons/ProfileFormButtons.jsx";
import s from "./OpenShopForm.module.scss";

import type { RootState } from "src/Types/store.ts";

const OpenShopForm = () => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const emailInput = document.querySelector("#changeEmail");
    const passwordInputs = formRef.current?.querySelectorAll(
      "input[type=password]"
    );

    e.preventDefault();
    checkEmptyInputs({
      exceptions: ["address", "currentPass", "newPass", "confirmPass"],
      formRef: formRef,
    });
    // checkEmailValidation(emailInput);
    // checkPasswordInputs(passwordInputs, loginInfo.password);
    // updateUserInfo(formRef, dispatch, t);
  }

  return (
    <form
      method="POST"
      ref={formRef}
      className={s.profileForm}
      onSubmit={handleSubmit}
    >
      <h2>Open Your Shop</h2>
      <OpenShopInputs />
      <ProfileFormButtons />
    </form>
  );
};
export default OpenShopForm;

// function updateUserInfo(formRef, dispatch, t) {
//   const formEle = formRef.current;
//   const inputs = formEle.querySelectorAll("input");
//   const isFormValid = checkAreInputsValid(inputs);

//   if (!isFormValid) return;

//   const updatedUserData = {
//     username: `${inputs[0].value} ${inputs[1].value}`,
//     email: inputs[2].value,
//     phoneNumber: inputs[3].value,
//     address: inputs[4].value,
//     password: inputs[5].value,
//   };

//   if (updatedUserData.password === "") delete updatedUserData.password;

//   dispatch(updateUserData({ updatedUserData }));
//   updateUserInfoAlert(dispatch, t);
// }

// function updateUserInfoAlert(dispatch, t) {
//   const alertText = t("toastAlert.accountInfoUpdated");
//   const alertState = "success";
//   setTimeout(
//     () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
//     300
//   );
// }
