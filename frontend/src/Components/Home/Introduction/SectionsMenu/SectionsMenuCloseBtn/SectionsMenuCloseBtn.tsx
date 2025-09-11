import { useDispatch } from "react-redux";
import { updateGlobalState } from "src/ReduxSlice/globalSlice.tsx";
import SvgIcon from "src/Components/Shared/MiniComponents/SvgIcon.tsx";
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
