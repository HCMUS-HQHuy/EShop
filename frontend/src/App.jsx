import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage";
import AppRoutes from "./Routes/AppRoutes";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { setLoginData } from "./Features/userSlice";
import { getCategories } from "./Features/categoriesSlice";

function App() {
  useStoreWebsiteDataToLocalStorage();
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch();
  const hasFetchedUserData = useRef(false);
  
  useEffect(() => {
      if (hasFetchedUserData.current) return;
      hasFetchedUserData.current = true;

      const fetchAll = async () => {
      await Promise.all([
          dispatch(setLoginData()),
          dispatch(getCategories()),
      ]);
      setIsReady(true);
      };
      fetchAll();
  }, [dispatch]);
  
  if (!isReady) {
    return <div>Loading...</div>;
  }

  return <AppRoutes />;
}

export default App;
