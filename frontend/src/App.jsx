import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage";
import AppRoutes from "./Routes/AppRoutes";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { setLoginData } from "./Features/userSlice";

function App() {
  useStoreWebsiteDataToLocalStorage();
  const dispatch = useDispatch();
  const hasFetchedUserData = useRef(false);

  useEffect(() => {
    if (hasFetchedUserData.current) return;
    hasFetchedUserData.current = true;
    dispatch(setLoginData());
  }, []);

  return <AppRoutes />;
}

export default App;
