import { useEffect } from "react";
import { useSelector } from "react-redux";
import { setItemToLocalStorage } from "../Helper/useLocalStorage.tsx";
import type { RootState } from "src/Types/store.ts";

const useStoreWebsiteDataToLocalStorage = () => {
  const userData = useSelector((state: RootState) => state.user);
  const productsData = useSelector((state: RootState) => state.products);
  const localStorageData = useSelector((state: RootState) => state.global);

  useEffect(() => {
    setItemToLocalStorage("productsSliceData", productsData);
    setItemToLocalStorage("userSliceData", userData);
    setItemToLocalStorage("storageSliceData", localStorageData);
  }, [userData, productsData, localStorageData]);
};
export default useStoreWebsiteDataToLocalStorage;
