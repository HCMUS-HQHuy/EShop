import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage.jsx";
import AppRoutes from "./Routes/IndexRoutes.tsx";
import { useDispatch } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { setLoginData } from "./Features/userSlice.jsx";
import { getCategories } from "./Features/categoriesSlice.jsx";
import type { AppDispatch } from "./Types/store.ts";

function App() {
  useStoreWebsiteDataToLocalStorage();
  const [isReady, setIsReady] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
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
