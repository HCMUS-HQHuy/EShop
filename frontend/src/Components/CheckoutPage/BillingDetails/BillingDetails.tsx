import { useTranslation } from "react-i18next";
import CustomCheckbox from "../../Shared/MiniComponents/CustomCheckbox/CustomCheckbox.tsx";
import BillingInputs from "../BillingDetailsInputs/BillingInputs.tsx";
import s from "./BillingDetails.module.scss";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "src/Types/store.ts";
import { useEffect } from "react";
import { storeToStorage } from "src/Features/productsSlice.tsx";
import { STORAGE_KEYS } from "src/Types/common.ts";

type Props = {
  inputsData: {
    billingValues: {
      [key: string]: any;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
}

const BillingDetails = ({ inputsData: { billingValues, handleChange } }: Props) => {
  const { t } = useTranslation();
  
  return (
    <section className={s.billingDetailsSection}>
      <h2>{t("billingDetails")}</h2>

      <BillingInputs inputsData={{ billingValues, handleChange }} />

      <CustomCheckbox
        inputData={{
          name: "saveInfo",
          isRequired: false,
          id: "save-info",
        }}
      />
    </section>
  );
};
export default BillingDetails;
