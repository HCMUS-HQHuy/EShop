import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  multiUpdateGlobalState,
  updateGlobalState,
} from "src/Features/globalSlice.tsx";
import s from "./GlobalOverlay.module.scss";
import type { RootState } from "src/Types/store.ts";

const GlobalOverlay = () => {
  const dispatch = useDispatch();
  const { isOverlayActive, isMobileMenuActive, isProfileMenuActive } =
    useSelector((state: RootState) => state.global);
  const activeClass = isOverlayActive ? s.active : "";

  function handleOverlayClick(e: React.MouseEvent | React.KeyboardEvent) {
    if ("key" in e && e.key === "Enter") return;

    const closeMenuAndOverlayAction = multiUpdateGlobalState({
      isSectionsMenuActive: false,
      isOverlayActive: false,
    });
    dispatch(closeMenuAndOverlayAction);

    if (isMobileMenuActive)
      dispatch(updateGlobalState({ key: "isMobileMenuActive", value: false }));
    if (isProfileMenuActive)
      dispatch(updateGlobalState({ key: "isProfileMenuActive", value: false }));
  }

  function toggleScrollbar() {
    document.body.style.overflow = isOverlayActive ? "hidden" : "";
  }

  useEffect(() => toggleScrollbar(), [isOverlayActive]);

  return (
    <div
      aria-label="Overlay closed"
      aria-hidden={!isMobileMenuActive}
      tabIndex={isMobileMenuActive ? 0 : -1}
      className={`${s.overlay} ${activeClass}`}
      onClick={handleOverlayClick}
      onKeyUp={handleOverlayClick}
    />
  );
};

export default GlobalOverlay;
