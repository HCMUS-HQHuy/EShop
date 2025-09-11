import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { arraysToEmpty } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/ReduxSlice/alertsSlice.tsx";
import { setEmptyArrays } from "src/ReduxSlice/productsSlice.tsx";
import type { AppDispatch } from "src/Types/store.ts";
import type { TFunction } from "i18next";
import { updateUserData } from "src/ReduxSlice/userSlice.tsx";
import api from "src/Api/index.api.ts";
import { ALERT_STATE } from "src/Types/common.ts";

const useSignOut = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await api.user.logout();
      const emptyArraysAction = setEmptyArrays({ keys: arraysToEmpty });
      dispatch(emptyArraysAction);
      dispatch(updateUserData({
        username: "",
        email: "",
        address: "",
        phoneNumber: "",
        isSignIn: false,
      }));
      showSignOutAlert(dispatch, t);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return handleSignOut;
};

export default useSignOut;

function showSignOutAlert(dispatch: AppDispatch, t: TFunction, delay = 500) {
  setTimeout(() => {
    dispatch(
      showAlert({
        alertText: t("toastAlert.signOutSuccess"),
        alertState: ALERT_STATE.WARNING,
        alertType: "alert",
      })
    );
  }, delay);
}
