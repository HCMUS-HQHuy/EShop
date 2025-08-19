import { Outlet,  Link, Routes, Route } from 'react-router-dom';
import SellerSidebar from './SellerSidebar/SellerSidebar.tsx';
import s from './SellerDashboardPage.module.scss';
import { Helmet } from 'react-helmet-async';
import ProductsPage from './ManageProducts/ManageProducts.tsx';
import DashboardOverview from './DashboardOverview/DashboardOverview.tsx';
import ManageOrders from './ManageOrders/ManageOrders.tsx';

const SellerDashboardPageLayout = () => {
  return (
    <div className={s.dashboardLayout}>
      <SellerSidebar />
      <main className={s.mainContent}>
        <Outlet /> {/* Các trang con sẽ được render ở đây */}
      </main>
    </div>
  );
};

const SellerDashboardPage = () => {
  return (
    <>
      <Helmet>
        <title>Seller Dashboard</title>
      </Helmet>
      {/* <div className={s.dashboardLayout}> */}
        {/* <SellerSidebar /> */}
        {/* <main className={s.mainContent}> */}
          {/* <Outlet /> */}
        {/* </main> */}
      {/* </div> */}
      <Routes>
        <Route path="/" element={<SellerDashboardPageLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<ManageOrders />} />
        </Route>
      </Routes>
    </>
  );
};

export default SellerDashboardPage;