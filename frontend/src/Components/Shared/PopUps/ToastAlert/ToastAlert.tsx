import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOAST_ALERT_DURATION_MS } from "src/Data/globalVariables.tsx";
import { updateAlertState } from "src/ReduxSlice/alertsSlice.tsx";
import SvgIcon from "../../MiniComponents/SvgIcon.tsx";
import s from "./ToastAlert.module.scss";
import type { RootState } from "src/Types/store.ts";
import { ALERT_STATE } from "src/Types/common.ts";

const ToastAlert = () => {
  const { alert } = useSelector((state: RootState) => state.alerts);
  const { isAlertActive, alertText, alertState } = alert;
  const dispatch = useDispatch();
  const { iconName, className } = toastState[alertState];
  const showClass = isAlertActive ? s.show : "";
  const debounceId = useRef<NodeJS.Timeout>(undefined);

  function setToastAlertTimeout() {
    if (!showClass) return;

    debounceId.current = setTimeout(() => {
      dispatch(
        updateAlertState({ key: "isAlertActive", value: false, type: "alert" })
      );
    }, TOAST_ALERT_DURATION_MS);
  }

  useEffect(() => {
    setToastAlertTimeout();
    return () => clearTimeout(debounceId.current);
  }, [alertState, alertText]);

  return (
    <div className={`${s.toastAlert} ${className} ${showClass}`} dir="ltr">
      <div className={s.iconHolder}>
        <div className={s.radialColor} />
        <SvgIcon name={iconName} />
      </div>

      <p dir="ltr">{alertText}</p>
    </div>
  );
};

export default ToastAlert;

const toastState: Record<
  ALERT_STATE,
  { iconName: string; className: string }
> = {
  [ALERT_STATE.SUCCESS]: { iconName: "checked", className: s.success },
  [ALERT_STATE.WARNING]: { iconName: "exclamation", className: s.warning },
  [ALERT_STATE.ERROR]: { iconName: "xMark", className: s.error },
};