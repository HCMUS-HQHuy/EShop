import { useDispatch } from "react-redux";
import { updateGlobalState } from "Features/globalSlice.jsx";
import SvgIcon from "Components/Shared/MiniComponents/SvgIcon.jsx";
import s from "./SectionsMenuCloseBtn.module.scss";

const SectionsMenuCloseBtn = () => {
  const dispatch = useDispatch();

  function closeMenu() {
    dispatch(updateGlobalState({ key: "isSectionsMenuActive", value: false }));
    dispatch(updateGlobalState({ key: "isOverlayActive", value: false }));
  }

  return (
    <button
      type="button"
      className={s.closeBtn}
      onClick={closeMenu}
      aria-label="Close menu"
    >
      <SvgIcon name="xMark" />
    </button>
  );
};
export default SectionsMenuCloseBtn;
