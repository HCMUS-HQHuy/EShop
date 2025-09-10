import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { pagesRequireSignIn, authPaths } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { USER_ROLE } from "src/Types/common.ts";
import type { RootState } from "src/Types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { userRole } = useSelector((state: RootState) => state.global);
  const { isSignIn } = loginInfo;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathName = location.pathname;

  const isPageRequiringSignIn = (page: string) =>
    !isSignIn && (pagesRequireSignIn.includes(page) || isPageForSeller(page));
  const isPageForSeller = (page: string) => page.startsWith("/seller");

  if (authPaths.includes(pathName) && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/login" />;
  }
  switch (userRole) {
    case USER_ROLE.CUSTOMER:
      if (isPageForSeller(pathName)) {
        loginFirstAlert();
        return <Navigate to="/" />;
      }
      break;
    case USER_ROLE.SELLER:
      if (!isPageForSeller(pathName))
        return <Navigate to="/seller" />;
      break;
    default:
      console.error("Unknown user role:", userRole);
      break;
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
