import About from "src/Components/About/About.tsx";
import AccountPage from "src/Components/AccountPage/AccountPage.tsx";
import Cart from "src/Components/Cart/Cart.tsx";
import CheckoutPage from "src/Components/CheckoutPage/CheckoutPage.tsx";
import Contact from "src/Components/Contact/Contact.tsx";
import FavoritePage from "src/Components/FavoritePage/FavoritePage.tsx";
import Home from "src/Components/Home/Home.tsx";
import LogIn from "src/Components/LogIn/LogIn.tsx";
import NotFoundPage from "src/Components/NotFoundPage/NotFoundPage.tsx";
import OrderPage from "src/Components/OrderPage/OrderPage.tsx";
import ProductDetailsPage from "src/Components/ProductDetailsPage/ProductDetailsPage.tsx";
import ProductsCategoryPage from "src/Components/ProductsCategory/ProductsCategoryPage.tsx";
import ProductsPage from "src/Components/ProductsPage/ProductsPage.tsx";
import SearchPage from "src/Components/Search/SearchPage.tsx";
import SignUp from "src/Components/SignUp/SignUp.tsx";
import WishList from "src/Components/WishList/WishList.tsx";
import ResetPassword from "src/Components/ResetPassword/ResetPassword.tsx";
import ForgotPassword from "src/Components/ForgotPassword/ForgotPassword.tsx";

import StartSellingPage from "src/Components/SellerDashboard/StartSelling/StartSelling.tsx"
import ChatPageLayout from "src/Components/Chat/ChatPageLayout.tsx";
import DashboardOverview from "src/Components/SellerDashboard/DashboardOverview/DashboardOverview.tsx";
import ManageOrders from "src/Components/SellerDashboard/ManageOrders/ManageOrders.tsx";
import StartSelling from "src/Components/SellerDashboard/StartSelling/StartSelling.tsx";
import AddProductPage from "src/Components/SellerDashboard/AddProductPage/AddProductPage.tsx";
import ManageProducts from "src/Components/SellerDashboard/ManageProducts/ManageProducts.tsx";
import { USER_ROLE } from "src/Types/common.ts";

export const ROUTES_CONFIG = [
  { path: "/", element: <Home /> },
  { path: "/contact", element: <Contact /> },
  { path: "/about", element: <About /> },
  { path: "/details", element: <ProductDetailsPage /> },
  { path: "/category", element: <ProductsCategoryPage /> },
  { path: "/products", element: <ProductsPage /> },
  { path: "/favorites", element: <FavoritePage /> },
  { path: "/wishlist", element: <WishList /> },
  { path: "/cart", element: <Cart /> },
  { path: "/checkout", element: <CheckoutPage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <LogIn /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/profile/*", element: <AccountPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/seller", element: <DashboardOverview /> },
  { path: "/become-seller", element: <StartSelling /> },
  { path: "/chats", element: <ChatPageLayout /> },
  { path: "/seller/products", element: <ManageProducts /> },
  { path: "/seller/products/new", element: <AddProductPage /> },
  { path: "/seller/products/edit/:productId", element: <AddProductPage /> },
  { path: "/seller/orders", element: <ManageOrders /> },
  { path: "/seller/chats", element: <ChatPageLayout /> },
  { path: "*", element: <NotFoundPage /> },
];