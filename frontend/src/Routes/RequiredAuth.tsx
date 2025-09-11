import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { authPaths } from "src/Data/globalVariables.tsx";
import { showAlert } from "src/Features/alertsSlice.tsx";
import { updateGlobalState } from "src/Features/globalSlice.tsx";
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

  const isPageForGuest = (page: string) => authPaths.includes(page) && page === '/';
  const isPageForSeller = (page: string) => page.startsWith("/seller");

  if (authPaths.includes(pathName) && isSignIn) return <Navigate to="/" />;
  if (!isPageForGuest(pathName) && !isSignIn) {
    loginFirstAlert();
    return (authPaths.includes(pathName) ? children : <Navigate to="/login" />);
  }

  if (isPageForSeller(pathName)) {
    if (!shopInfo.status) {
      return <Navigate to="/become-seller" />;
    }
    if (userRole === USER_ROLE.SELLER) {
      switch (shopInfo.status) {
        case SHOP_STATUS.PENDING_VERIFICATION:
          return (pathName !== "/seller/pending" ? <Navigate to="/seller/pending" /> : children);
        case SHOP_STATUS.REJECTED:
          return (pathName !== "/seller/rejected" ? <Navigate to="/seller/rejected" /> : children);
        case SHOP_STATUS.ACTIVE:
        case SHOP_STATUS.CLOSED:
          dispatch(updateGlobalState({ key: "userRole", value: USER_ROLE.SELLER }));
          return (pathName === "seller/pending" || pathName === "seller/rejected" || pathName === "seller/pending" || pathName === "seller/banned" ? <Navigate to="/seller" /> : children);
        case SHOP_STATUS.BANNED:
          return (pathName !== "/seller/banned" ? <Navigate to="/seller/banned" /> : children);
        default:
        console.error("Unknown shop status:", shopInfo.status);
        break;
      }
    } else {
      return <Navigate to="/" />;
    }
  } else if (userRole === USER_ROLE.SELLER) {
    return <Navigate to="/seller" />;
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
