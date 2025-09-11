import { useDispatch } from "react-redux";
import { multiUpdateGlobalState } from "src/ReduxSlice/globalSlice.tsx";
import SvgIcon from "../../Shared/MiniComponents/SvgIcon.jsx";
import s from "./AccountMenuIcon.module.scss";
import type { AppDispatch } from "src/Types/store.ts";

const AccountMenuIcon = () => {
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      className={s.profileSectionsButton}
      aria-label="List of Profile sections"
      title="Sections list"
      onClick={() => openProfileMenu(dispatch)}
    >
      <SvgIcon name="list" />
    </button>
  );
};
export default AccountMenuIcon;

function openProfileMenu(dispatch: AppDispatch) {
  const payload = {
    isProfileMenuActive: true,
    isOverlayActive: true,
  };
  dispatch(multiUpdateGlobalState(payload));
}
