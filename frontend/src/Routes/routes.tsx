import About from "Components/About/About.jsx";
import AccountPage from "Components/AccountPage/AccountPage.jsx";
import Cart from "Components/Cart/Cart.jsx";
import CheckoutPage from "Components/CheckoutPage/CheckoutPage.jsx";
import Contact from "Components/Contact/Contact.jsx";
import FavoritePage from "Components/FavoritePage/FavoritePage.jsx";
import Home from "Components/Home/Home.jsx";
import LogIn from "Components/LogIn/LogIn.tsx";
import NotFoundPage from "Components/NotFoundPage/NotFoundPage.jsx";
import OrderPage from "Components/OrderPage/OrderPage.jsx";
import ProductDetailsPage from "Components/ProductDetailsPage/ProductDetailsPage.jsx";
import ProductsCategoryPage from "Components/ProductsCategory/ProductsCategoryPage.jsx";
import ProductsPage from "Components/ProductsPage/ProductsPage.jsx";
import SearchPage from "Components/Search/SearchPage.jsx";
import SignUp from "Components/SignUp/SignUp.tsx";
import WishList from "Components/WishList/WishList.jsx";

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
  { path: "/profile", element: <AccountPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "*", element: <NotFoundPage /> },
];
