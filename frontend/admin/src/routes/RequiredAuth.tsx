import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../types/store.ts";

const RequiredAuth = ({ children }: { children: React.ReactNode }) => {
  const { loginInfo } = useSelector((state: RootState) => state.user);
  const { isSignIn } = loginInfo;
  const location = useLocation();
  const pathName = location.pathname;
  const isLoginOrSignUpPage = pathName === "/login" || pathName === "/signup";

  const isPageRequiringSignIn = () =>
    !isSignIn && isLoginOrSignUpPage === false;
  console.log("RequiredAuth: isSignIn:", isSignIn);
  if (isLoginOrSignUpPage && isSignIn) return <Navigate to="/" />;
  if (isPageRequiringSignIn()) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default RequiredAuth;
