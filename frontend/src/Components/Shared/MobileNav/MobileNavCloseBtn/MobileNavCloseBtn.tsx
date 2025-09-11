import { useDispatch, useSelector } from "react-redux";
import { updateGlobalState } from "src/ReduxSlice/globalSlice.tsx";
import SvgIcon from "../../MiniComponents/SvgIcon.tsx";
import s from "./MobileNavCloseBtn.module.scss";
import type { RootState } from "src/Types/store.ts";

const MobileNavCloseBtn = () => {
  const { isMobileMenuActive } = useSelector((state: RootState) => state.global);
  const dispatch = useDispatch();

  function closeMenu() {
    dispatch(updateGlobalState({ key: "isMobileMenuActive", value: false }));
    dispatch(updateGlobalState({ key: "isOverlayActive", value: false }));
  }

  return (
    <button
      type="button"
      className={s.closeBtn}
      onClick={closeMenu}
      aria-label="Close menu"
      aria-hidden={!isMobileMenuActive}
      tabIndex={isMobileMenuActive ? 0 : -1}
    >
      <SvgIcon name="xMark" />
    </button>
  );
};
export default MobileNavCloseBtn;
