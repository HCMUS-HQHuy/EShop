import product from "./products.user.controllers";
import order from "./order.user.controllers";
import infor from "./infor.user.controllers";
import category from "./categories.user.controllers";
import payment from "./payment.user.controllers";

const user = {
    product,
    order,
    category,
    infor,
    payment
}
export default user;