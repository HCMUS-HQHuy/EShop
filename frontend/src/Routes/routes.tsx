import AccountPage from "src/Components/AccountPage/AccountPage.tsx";
import Cart from "src/Components/Cart/Cart.tsx";
import CheckoutPage from "src/Components/CheckoutPage/CheckoutPage.tsx";
import Home from "src/Components/Home/Home.tsx";
import LogIn from "src/Components/LogIn/LogIn.tsx";
import NotFoundPage from "src/Components/NotFoundPage/NotFoundPage.tsx";
import OrderPage from "src/Components/OrderPage/OrderPage.tsx";
import ProductDetailsPage from "src/Components/ProductDetailsPage/ProductDetailsPage.tsx";
import ProductsCategoryPage from "src/Components/ProductsCategory/ProductsCategoryPage.tsx";
import ProductsPage from "src/Components/ProductsPage/ProductsPage.tsx";
import SearchPage from "src/Components/Search/SearchPage.tsx";
import SignUp from "src/Components/SignUp/SignUp.tsx";
import ResetPassword from "src/Components/ResetPassword/ResetPassword.tsx";
import ForgotPassword from "src/Components/ForgotPassword/ForgotPassword.tsx";

import ChatPageLayout from "src/Components/Chat/ChatPageLayout.tsx";
import DashboardOverview from "src/Components/SellerDashboard/DashboardOverview/DashboardOverview.tsx";
import ManageOrders from "src/Components/SellerDashboard/ManageOrders/ManageOrders.tsx";
import AddProductPage from "src/Components/SellerDashboard/AddProductPage/AddProductPage.tsx";
import ManageProducts from "src/Components/SellerDashboard/ManageProducts/ManageProducts.tsx";
import OrderDetailPage from "src/Components/SellerDashboard/OrderDetailPage/OrderDetailPage.tsx";
import PendingPage from "src/Components/SellerDashboard/StartSelling/PendingPage.tsx";
import BecomeSellerPage from "src/Components/SellerDashboard/StartSelling/BecomeSellerPage.tsx";
import RejectedPage from "src/Components/SellerDashboard/StartSelling/RejectedPage.tsx";

export const ROUTES_CONFIG = [
  { path: "/", element: <Home /> },
  { path: "/details", element: <ProductDetailsPage /> },
  { path: "/category", element: <ProductsCategoryPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/profile", element: <AccountPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/seller", element: <DashboardOverview /> },
  { path: "/become-seller", element: <BecomeSellerPage /> },
  { path: "/seller/pending", element: <PendingPage /> },
  { path: "/seller/rejected", element: <RejectedPage /> },
  { path: "/seller/banned", element: <RejectedPage /> },
  { path: "/chats", element: <ChatPageLayout /> },
  { path: "/seller/products", element: <ManageProducts /> },
  { path: "/seller/products/new", element: <AddProductPage /> },
  { path: "/seller/products/edit/:productId", element: <AddProductPage /> },
  { path: "/seller/orders", element: <ManageOrders /> },
  { path: "/seller/orders/:orderId", element: <OrderDetailPage /> },
  { path: "/seller/chats", element: <ChatPageLayout /> },
  { path: "*", element: <NotFoundPage /> },
];