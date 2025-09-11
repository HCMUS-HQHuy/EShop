import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { arraysToEmpty } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { setEmptyArrays } from "src/ReduxSlice/productsSlice.tsx";
import { signOut } from "src/ReduxSlice/userSlice.tsx";
import type { AppDispatch } from "src/Types/store.ts";
import type { TFunction } from "i18next";

const useSignOut = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleSignOut = () => {
    const emptyArraysAction = setEmptyArrays({ keys: arraysToEmpty });

    dispatch(emptyArraysAction);
    dispatch(signOut());
    showSignOutAlert(dispatch, t);
  };

  return handleSignOut;
};

export default useSignOut;

export function showSignOutAlert(dispatch: AppDispatch, t: TFunction, delay = 500) {
  setTimeout(() => {
    dispatch(
      showAlert({
        alertText: t("toastAlert.signOutSuccess"),
        alertState: "warning",
        alertType: "alert",
      })
    );
  }, delay);
}
