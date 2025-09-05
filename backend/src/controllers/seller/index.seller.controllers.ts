import product from "controllers/seller/products.seller.controllers";
import shop from "controllers/seller/account.seller.controllers";
import order from "./order.seller.controllers";;

const sellerController = {
    product,
    shop,
    order
};

export default sellerController;
