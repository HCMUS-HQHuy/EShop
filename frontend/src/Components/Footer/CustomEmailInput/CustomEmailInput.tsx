import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { SCREEN_SIZES } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import {
  sendToolTipLeftPos,
  sendingToolTipLeftPos,
} from "src/Functions/tooltipPositions.ts";
import { isEmailValid } from "src/Functions/validation.ts";
import useGetResizeWindow from "src/Hooks/Helper/useGetResizeWindow.tsx";
import useOnlineStatus from "src/Hooks/Helper/useOnlineStatus.tsx";
import SpinnerLoading from "../../Shared/Loaders/SpinnerLoading.tsx";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon.tsx";
import ToolTip from "../../Shared/MiniComponents/ToolTip.tsx";
import s from "./CustomEmailInput.module.scss";
import { ALERT_STATE } from "src/Types/common.ts";

const CustomEmailInput = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { windowWidth } = useGetResizeWindow();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRef = useRef();

  const isWebsiteOnline = useOnlineStatus();
  const sendIconDirection = {
    rotate: i18n.dir() === "rtl" ? "180deg" : "0deg",
  };

  // Tooltip variables
  const sendIconToolTipTopPos =
    windowWidth <= SCREEN_SIZES.mobile ? "-13px" : "50%";

  const sendIconToolTipLeftPos =
    windowWidth <= SCREEN_SIZES.mobile
      ? "50%"
      : sendToolTipLeftPos(i18n.language);

  const sendingIconToolTipLeftPos =
    windowWidth <= SCREEN_SIZES.mobile
      ? "50%"
      : sendingToolTipLeftPos(i18n.language);

  const toolTipLeftPosition = loading
    ? sendingIconToolTipLeftPos
    : sendIconToolTipLeftPos;

  const toolTipTextNoun = loading
    ? t("footer.section1.sendingLabel")
    : t("footer.section1.sendLabel");

  const sendEmail = (e) => {
    const emailInput = e.target.querySelector("input");

    e.preventDefault();
    if (loading || !isEmailValid(emailInput)) return;

    subscription();
    emailRef.current.blur();
  };

  const subscription = () => {
    const alertText = isWebsiteOnline
      ? t("toastAlert.subscriptionSuccess")
      : t("toastAlert.subscriptionFailed");
    const alertState = isWebsiteOnline ? ALERT_STATE.SUCCESS: ALERT_STATE.ERROR;

    if (isWebsiteOnline) {
      setLoading(true);
      setEmail("");
    }

    setTimeout(() => {
      dispatch(showAlert({ alertText, alertState, alertType: "alert" }));
      setLoading(false);
    }, 3000);
  };

  return (
    <form className={s.form} onSubmit={sendEmail}>
      <input
        type="email"
        placeholder={t("inputsPlaceholders.enterYourEmail")}
        value={email}
        autoComplete="off"
        aria-describedby="email-tooltip"
        onChange={(e) => setEmail(e.target.value)}
        ref={emailRef}
        aria-required="false"
      />

      <button aria-label="Send mail" type="submit">
        <div style={sendIconDirection}>
          {!loading && <SvgIcon name="vector" />}
          {loading && <SpinnerLoading />}
        </div>

        <ToolTip
          top={sendIconToolTipTopPos}
          left={toolTipLeftPosition}
          content={toolTipTextNoun}
        />
      </button>
    </form>
  );
};

export default CustomEmailInput;
