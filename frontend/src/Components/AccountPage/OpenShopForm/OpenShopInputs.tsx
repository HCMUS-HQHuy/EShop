import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import EditProfileInput from "./OpenShopInput.tsx";
import s from "./OpenShopInputs.module.scss";
import type { RootState } from "src/Types/store.ts";

const OpenShopInputs = () => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
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
            label: "Shop Name",
            name: "shopName",
            value: usernameState,
            setValue: setUsername,
          }}
        />

        <EditProfileInput
          inputData={{
            label: "Business Email",
            name: "businessEmail",
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
            placeholder: "Your business phone number",
          }}
        />

        <EditProfileInput
          inputData={{
            label: "Shop Address",
            name: "address",
            value: addressState,
            setValue: setAddress,
            placeholder: "Enter your shop address",
          }}
        />
      </section>

      <section className={s.shopDescription}>
        <EditProfileInput
          inputData={{
            type: "textarea",
            label: "Shop Description",
            name: "shopDescription",
            value: "",
            setValue: () => {},
            placeholder: "Describe your shop",
          }}
        />
      </section>
    </section>
  );
};
export default OpenShopInputs;
