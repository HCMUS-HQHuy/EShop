import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
// import { pagesRequireSignIn } from "Data/globalVariables.jsx";
// import { showAlert } from "Features/alertsSlice.jsx";
import type { RootState } from "../types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  // const { loginInfo } = useSelector((state: RootState) => state.user);
  // const { isSignIn } = loginInfo;
  const isSignIn = false;
  const location = useLocation();
  // const dispatch = useDispatch();
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  const isPageRequiringSignIn = () =>
    !isSignIn && isLoginOrSignUpPage === false;

  if (isLoginOrSignUpPage && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn()) {
    return <Navigate to="/login" />;
  }

  // function loginFirstAlert() {
  //   const alertText = t("toastAlert.pageRequiringSignIn");
  //   const alertState = "warning";
  //   setTimeout(
  //     () => dispatch(showAlert({ alertText, alertState, alertType: "alert" })),
  //     300
  //   );
  // }

  return children;
};

export default RequiredAuth;
