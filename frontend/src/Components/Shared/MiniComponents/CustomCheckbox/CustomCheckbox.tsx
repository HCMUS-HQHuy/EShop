import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { updateProductsState } from "src/ReduxSlice/productsSlice.tsx";
import SvgIcon from "../SvgIcon.tsx";
import s from "./CustomCheckbox.module.scss";
import type { RootState } from "src/Types/store.ts";

type Props = {
  inputData: {
    name: string,
    isRequired?: boolean,
    id: string,
  }
}

const CustomCheckbox = ({ inputData: { name, isRequired = false, id } }: Props) => {
  const { saveBillingInfoToLocal } = useSelector((state: RootState) => state.products);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  function handleCheckboxChange(e: React.ChangeEvent<HTMLInputElement>) {
    const isInputChecked = e.target.checked;
    setSaveBillingInfo(isInputChecked);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    const isEnterPressed = e.keyCode === 13;
    if (!isEnterPressed) return;
    setSaveBillingInfo(!saveBillingInfoToLocal);
  }

  function setSaveBillingInfo(value: boolean) {
    const updateAction = updateProductsState({
      key: "saveBillingInfoToLocal",
      value: value,
    });
    dispatch(updateAction);
  }

  return (
    <div className={s.checkboxContainer}>
      <div className={s.customInput}>
        <input
          type="checkbox"
          name={name}
          checked={saveBillingInfoToLocal}
          onChange={handleCheckboxChange}
          onKeyDown={handleKeyPress}
          required={isRequired}
          aria-required={isRequired}
          id={id}
        />

        <SvgIcon name="checked" />
      </div>

      <label htmlFor="save-info">{t("inputsLabels.saveThisInfo")}</label>
    </div>
  );
};
export default CustomCheckbox;
