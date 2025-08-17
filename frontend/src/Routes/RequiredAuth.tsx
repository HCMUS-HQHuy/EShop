import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { pagesRequireSignIn } from "Data/globalVariables.jsx";
import { showAlert } from "Features/alertsSlice.jsx";
import type { RootState } from "Types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { isSignIn } = loginInfo;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  const isPageRequiringSignIn = (page: string) =>
    !isSignIn && pagesRequireSignIn.includes(page);

  if (isLoginOrSignUpPage && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/signup" />;
  }

  function loginFirstAlert() {
    const alertText = t("toastAlert.pageRequiringSignIn");
    const alertState = "warning";
    setTimeout(
      () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
      300
    );
  }

  return children;
};

export default RequiredAuth;
