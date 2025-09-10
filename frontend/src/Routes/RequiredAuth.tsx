import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { pagesRequireSignIn, authPaths } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { SHOP_STATUS, USER_ROLE } from "src/Types/common.ts";
import type { RootState } from "src/Types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { userRole } = useSelector((state: RootState) => state.global);
  const { shopInfo } = useSelector((state: RootState) => state.seller);
  const { isSignIn } = loginInfo;
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pathName = location.pathname;

  console.log("RequiredAuth: ", { loginInfo, isSignIn, userRole, shopInfo });

  const isPageRequiringSignIn = (page: string) =>
    !isSignIn && (pagesRequireSignIn.includes(page) || isPageForSeller(page));
  const isPageForSeller = (page: string) => page.startsWith("/seller");

  if (authPaths.includes(pathName) && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn(pathName)) {
    loginFirstAlert();
    return <Navigate to="/login" />;
  }

  if (pathName.startsWith("/become-seller") && isSignIn) {
    if (userRole === USER_ROLE.SELLER) {
      return <Navigate to="/seller" />;
    }
    switch (shopInfo.status) {
      case SHOP_STATUS.PENDING_VERIFICATION:
        return (pathName !== "/become-seller/pending" ? <Navigate to="/become-seller/pending" /> : children);
      case SHOP_STATUS.REJECTED:
        return (pathName !== "/become-seller/rejected" ? <Navigate to="/become-seller/rejected" /> : children);
      case null:
        return (pathName === "/become-seller" ? children : <Navigate to="/become-seller" />);
      default:
        console.error("Unknown shop status:", shopInfo.status);
        break;
    }
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
