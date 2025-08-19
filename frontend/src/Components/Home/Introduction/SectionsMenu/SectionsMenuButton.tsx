import { useDispatch } from "react-redux";
import { multiUpdateGlobalState } from "Features/globalSlice.jsx";
import SvgIcon from "Components/Shared/MiniComponents/SvgIcon.jsx";
import s from "./SectionsMenuButton.module.scss";
import type { AppDispatch } from "Types/store.ts";

const SectionsMenuButton = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <button
      type="button"
      onClick={() => openSectionMenu(dispatch)}
      className={s.sectionsMenuButton}
      aria-label="Toggle sections menu"
    >
      <SvgIcon name="list" />
    </button>
  );
};
export default SectionsMenuButton;

function openSectionMenu(dispatch: AppDispatch) {
  const payload = {
    isSectionsMenuActive: true,
    isOverlayActive: true,
  };
  dispatch(multiUpdateGlobalState(payload));
}
