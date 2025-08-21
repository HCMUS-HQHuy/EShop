import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { RiseLoader } from "react-spinners";

import { setLoginData } from "./Features/userSlice.tsx";
import { getCategories } from "./Features/categoriesSlice.tsx";
import { setShopData } from "./Features/sellerSlice.tsx"
import type { AppDispatch } from "./Types/store.ts";
import useStoreWebsiteDataToLocalStorage from "./Hooks/App/useStoreWebsiteDataToLocalStorage.tsx";

const AppLoader = ({ children }: { children: ReactNode }) => {
    useStoreWebsiteDataToLocalStorage();
    const [isReady, setIsReady] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const hasFetchedUserData = useRef(false);

    useEffect(() => {
        if (hasFetchedUserData.current) return;
        console.log("Fetching initial data...");
        hasFetchedUserData.current = true;
        const fetchAll = async () => {
            await Promise.all([
                dispatch(setLoginData()),
                dispatch(getCategories()),
                dispatch(setShopData())
            ]);
            setIsReady(true);
        };
        fetchAll();
    }, []);

    if (!isReady) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",  
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <RiseLoader
                    color="#36d7b7"
                    cssOverride={{ display: "block" }}
                    loading
                    margin={10}
                    size={50}
                    speedMultiplier={1}
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default AppLoader;
