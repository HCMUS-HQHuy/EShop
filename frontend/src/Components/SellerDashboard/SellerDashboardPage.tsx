import { Outlet,  Link, Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import s from './SellerDashboardPage.module.scss';
import SellerSidebar from './SellerSidebar/SellerSidebar.tsx';
import ProductsPage from './ManageProducts/ManageProducts.tsx';
import DashboardOverview from './DashboardOverview/DashboardOverview.tsx';
import ManageOrders from './ManageOrders/ManageOrders.tsx';
import StartSelling from './StartSelling/StartSelling.tsx';
import { SHOP_STATUS, SOCKET_NAMESPACE, type ShopStatus } from 'src/Types/common.ts';
import useSocketIO from 'src/Hooks/Socket/useSocketIO.ts';
import { setShopStatus } from 'src/Features/sellerSlice.tsx';
import type { RootState, AppDispatch } from 'src/Types/store.ts';
import AddProductPage from './AddProductPage/AddProductPage.tsx';
import ChatPageLayout from '../Chat/ChatPageLayout.tsx';

const SellerDashboardPageLayout = () => {
  return (
    <div className={s.dashboardLayout}>
      <SellerSidebar />
      <main className={s.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

const SellerDashboardPage = () => {
  const { isOpen, val } = useSocketIO(SOCKET_NAMESPACE.SELLER);
  const { status } = useSelector((state: RootState) => state.seller.shopInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (status === SHOP_STATUS.ACTIVE || status === SHOP_STATUS.CLOSED) {
      // navigate('/seller');
      console.log("Navigating to seller dashboard");
    } else navigate('/seller/form-progress');
  }, [status]);

  useEffect(() => {
    if (isOpen && val) {
      const { shopStatus } = val;
      dispatch(setShopStatus(shopStatus as ShopStatus));
    }
  }, [val, isOpen]);

  return (
    <>
      <Helmet>
        <title>Seller Dashboard</title>
      </Helmet>
      <Routes>
        <Route path="form-progress" element={<StartSelling />} />
        <Route path="/" element={<SellerDashboardPageLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products/new" element={<AddProductPage />} />
            <Route path="products/edit/:productId" element={<AddProductPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </>
  );
};

export default SellerDashboardPage;