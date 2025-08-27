import { useTranslation } from "react-i18next";
import CustomCheckbox from "../../Shared/MiniComponents/CustomCheckbox/CustomCheckbox.tsx";
import BillingInputs from "../BillingDetailsInputs/BillingInputs.tsx";
import s from "./BillingDetails.module.scss";

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
