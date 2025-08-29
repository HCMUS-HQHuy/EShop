import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { pagesRequireSignIn, authPaths } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { APP_MODE, SHOP_STATUS } from "src/Types/common.ts";
import type { RootState } from "src/Types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { appMode } = useSelector((state: RootState) => state.global);
  const { status } = useSelector((state: RootState) => state.seller.shopInfo);
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
  if (isPageForSeller(pathName) && appMode !== APP_MODE.SELLER)
    return <Navigate to='/'/>;

  if (pathName === '/become-seller') {
    if (isSignIn && appMode === APP_MODE.SELLER && status === SHOP_STATUS.ACTIVE) 
      return <Navigate to='/seller/dashboard' />;
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
