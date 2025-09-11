import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { setLoginData } from "./ReduxSlice/userSlice.tsx";
import { getCategories } from "./ReduxSlice/categoriesSlice.tsx";
import { setShopData } from "./ReduxSlice/sellerSlice.tsx"
import { fetchProducts } from "./ReduxSlice/productsSlice.tsx";
import type { AppDispatch, RootState } from "./Types/store.ts";
import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage.tsx";
import LoadingPage from "./Components/LoadingPage/LoadingPage.tsx";
import { getPaymentMethods } from "./ReduxSlice/paymentSlice.tsx";
import api from "./Api/index.api.ts";
import { conversationFetch } from "./ReduxSlice/conversationSlice.tsx";

const AppLoader = ({ children }: { children: ReactNode }) => {
    useStoreWebsiteDataToLocalStorage();
    const [isReady, setIsReady] = useState(false);
    const { isSignIn } = useSelector((state: RootState) => state.user.loginInfo);
    const { userRole } = useSelector((state: RootState) => state.global);

    const dispatch = useDispatch<AppDispatch>();
    const hasFetchedUserData = useRef(false);

    useEffect(() => {
        if (hasFetchedUserData.current) return;
        hasFetchedUserData.current = true;
        const fetchAll = async () => {
            const isTokenValid = await api.user.validToken();
            if (isTokenValid && !isSignIn) {
                await Promise.all([
                    dispatch(setLoginData()),
                    dispatch(setShopData()),
                    dispatch(conversationFetch(userRole))
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
