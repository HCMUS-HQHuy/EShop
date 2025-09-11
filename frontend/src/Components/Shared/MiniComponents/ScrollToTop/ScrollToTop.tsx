import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { SCROLL_REQUIRED } from "src/Data/globalVariables.tsx";
import { scrollToTop } from "src/Functions/componentsFunctions.ts";
import { scrollToTopToolTipLeftPos } from "src/Functions/tooltipPositions.ts";
import useEventListener from "src/Hooks/Helper/useEventListener.tsx";
import SvgIcon from "../SvgIcon.tsx";
import ToolTip from "../ToolTip.tsx";
import s from "./ScrollToTop.module.scss";

const ScrollToTop = () => {
  const scrollTopButtonRef = useRef<HTMLButtonElement>(null);
  const { t, i18n } = useTranslation();
  const leftToolTipPos = scrollToTopToolTipLeftPos(i18n.language);

  function handleScrollTopVisibility() {
    if (!scrollTopButtonRef.current) return;
    const classListMethod = window.scrollY < SCROLL_REQUIRED ? "add" : "remove";
    scrollTopButtonRef.current.classList[classListMethod](s.hide);
  }

  useEventListener(window, "scroll", handleScrollTopVisibility, []);

  return (
    <button
      ref={scrollTopButtonRef}
      type="button"
      className={`${`${s.scrollTopButton} ${s.hide}`}`}
      onClick={scrollToTop}
      aria-label="Scroll to top button"
    >
      <SvgIcon name="arrowUp2" />
      <ToolTip
        top="50%"
        left={leftToolTipPos}
        content={t("tooltips.scrollToTop")}
      />
    </button>
  );
};
export default ScrollToTop;
