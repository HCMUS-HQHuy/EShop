import { useTranslation } from "react-i18next";
import { billingInputsData } from "src/Data/staticData.tsx";
import BillingInput from "./BillingInput.tsx";
import s from "./BillingInputs.module.scss";

const BillingInputs = ({ inputsData }: { inputsData : any}) => {
  const { billingValues, handleChange } = inputsData;
  const { t } = useTranslation();

  function onChange(event: React.ChangeEvent<HTMLInputElement>, name: string) {
    const isPhoneInput = name === "phoneNumber";
    const inputEvent = event.nativeEvent as InputEvent;
    const isNumber = inputEvent.data ? !isNaN(+inputEvent.data) : true;
    const isPaste = (event.nativeEvent as InputEvent).inputType === "insertFromPaste";

    if (isPhoneInput && !isNumber) return;
    if (isPhoneInput && isPaste) return;

    handleChange(event);
  }

  return (
    <div className={s.inputs}>
      {billingInputsData.map(
        ({ translationKey, name, type, required, id, regex }) => {
          const inputData = {
            value: billingValues[translationKey],
            name,
            label: t(`inputsLabels.${translationKey}`),
            required,
            type,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => onChange(event, name),
          };

          return <BillingInput key={id} inputData={inputData} />;
        }
      )}
    </div>
  );
};
export default BillingInputs;
