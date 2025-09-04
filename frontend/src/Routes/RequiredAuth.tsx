import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { pagesRequireSignIn, authPaths } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import useSocketIO from "src/Hooks/Socket/useSocketIO.ts";
import { APP_MODE, SHOP_STATUS, SOCKET_NAMESPACE } from "src/Types/common.ts";
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
  const navigate = useNavigate();

  useEffect(() => {
    if (
      pathName === '/become-seller' &&
      isSignIn &&
      appMode === APP_MODE.SELLER &&
      status === SHOP_STATUS.ACTIVE
    ) {
      navigate('/seller/dashboard', { replace: true });
    }
  }, [appMode, status]);

  const isPageRequiringSignIn = (page: string) =>
    !isSignIn && (pagesRequireSignIn.includes(page) || isPageForSeller(page));
  const isPageForSeller = (page: string) => page.startsWith("/seller");

  if (authPaths.includes(pathName) && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/login" />;
  }
  if (isPageForSeller(pathName) && appMode !== APP_MODE.SELLER) {
    return <Navigate to='/' />;
  }
  if (appMode === APP_MODE.SELLER && !isPageForSeller(pathName)) {
    return <Navigate to='/seller' />;
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
