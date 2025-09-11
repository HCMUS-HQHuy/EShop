import { useDispatch } from "react-redux";
import { multiUpdateGlobalState } from "src/ReduxSlice/globalSlice.tsx";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon.jsx";
import s from "./MobileNavIcon.module.scss";
import type { AppDispatch } from "src/Types/store.ts";

const MobileNavIcon = () => {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className={s.mobileNav}
      onClick={() => openMobileNav(dispatch)}
      aria-label="Toggle navigation menu"
    >
      <SvgIcon name="burgerMenu" />
    </button>
  );
};
export default MobileNavIcon;

function openMobileNav(dispatch: AppDispatch) {
  const payload = {
    isMobileMenuActive: true,
    isOverlayActive: true,
  };
  dispatch(multiUpdateGlobalState(payload));
}
