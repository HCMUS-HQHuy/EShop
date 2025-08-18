import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import EditProfileInput from "./EditProfileInput";
import s from "./EditProfileInputs.module.scss";

const EditProfileInputs = () => {
  const { loginInfo } = useSelector((state) => state.user);
  const { username, email, phoneNumber, address } = loginInfo;
  const [usernameState, setUsername] = useState(username);
  const [emailState, setEmail] = useState(email);
  const [phoneState, setPhone] = useState(phoneNumber);
  const [newPassword, setNewPassword] = useState("");
  const [addressState, setAddress] = useState(address);
  const { t } = useTranslation();

  return (
    <section className={s.inputs}>
      <section className={s.wrapper}>
        <EditProfileInput
          inputData={{
            label: t("inputsLabels.username"),
            name: "username",
            value: usernameState,
            setValue: setUsername,
          }}
        />

        <EditProfileInput
          inputData={{
            label: t("inputsLabels.email"),
            name: "changeEmail",
            value: emailState,
            setValue: setEmail,
            placeholder: "example@gmail.com",
          }}
        />

        <EditProfileInput
          inputData={{
            label: t("inputsLabels.phoneNumber"),
            name: "phoneNumber",
            value: phoneState,
            setValue: setPhone,
            placeholder: t("inputsPlaceholders.yourPhone"),
          }}
        />

        <EditProfileInput
          inputData={{
            label: t("inputsLabels.address"),
            name: "address",
            value: addressState,
            setValue: setAddress,
            placeholder: t("inputsPlaceholders.address"),
          }}
        />
      </section>

      <section className={s.passwordInputs}>
        <EditProfileInput
          inputData={{
            type: "password",
            label: t("inputsLabels.passwordChanges"),
            name: "currentPass",
            placeholder: t("inputsPlaceholders.currentPass"),
          }}
        />

        <EditProfileInput
          inputData={{
            type: "password",
            placeholder: t("inputsPlaceholders.newPass"),
            value: newPassword,
            setValue: setNewPassword,
          }}
        />

        <EditProfileInput
          inputData={{
            type: "password",
            placeholder: t("inputsPlaceholders.confirmPass"),
          }}
        />
      </section>
    </section>
  );
};
export default EditProfileInputs;
