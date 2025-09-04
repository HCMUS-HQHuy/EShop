import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { setLoginData } from "./Features/userSlice.tsx";
import { getCategories } from "./Features/categoriesSlice.tsx";
import { setShopData } from "./Features/sellerSlice.tsx"
import { fetchProducts } from "./Features/productsSlice.tsx";
import type { AppDispatch, RootState } from "./Types/store.ts";
import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage.tsx";
import LoadingPage from "./Components/LoadingPage/LoadingPage.tsx";
import { getPaymentMethods } from "./Features/paymentSlice.tsx";
import api from "./Api/index.api.ts";

const AppLoader = ({ children }: { children: ReactNode }) => {
    useStoreWebsiteDataToLocalStorage();
    const [isReady, setIsReady] = useState(false);
    const { isSignIn } = useSelector((state: RootState) => state.user.loginInfo);

    const dispatch = useDispatch<AppDispatch>();
    const hasFetchedUserData = useRef(false);

    useEffect(() => {
        if (hasFetchedUserData.current) return;
        console.log("Fetching initial data...");
        hasFetchedUserData.current = true;
        const fetchAll = async () => {
            const isTokenValid = await api.user.validToken();
            if (isTokenValid && !isSignIn) {
                await Promise.all([
                    dispatch(setLoginData()),
                    dispatch(setShopData())
                ]);
            }
            await Promise.all([
                dispatch(getCategories()),
                dispatch(fetchProducts()),
                dispatch(getPaymentMethods())
            ]);
            setIsReady(true);
        };
        fetchAll();
    }, []);

    if (!isReady) {
        return <LoadingPage />;
    }

    return <>{children}</>;
};

export default AppLoader;
