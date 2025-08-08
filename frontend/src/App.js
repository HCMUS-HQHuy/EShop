import React from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import SingleProduct from "./screens/SingleProduct";
import Login from "./screens/Login";
import Register from "./screens/Register";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import NotFound from "./screens/NotFound";
import PrivateRoute from "./auth/privateRoute";
import CheckoutScreen from "./screens/CheckoutScreen";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomeScreen} exact />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <PrivateRoute path="/products/:id" component={SingleProduct} />
        <PrivateRoute path="/profile" component={ProfileScreen} />
        <PrivateRoute path="/cart/:id?" component={CartScreen} />
        <PrivateRoute path="/placeorder" component={PlaceOrderScreen} />
        <PrivateRoute path="/order" component={OrderScreen} />
        <PrivateRoute path="/checkout" component={CheckoutScreen} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  );
};

export default App;
