import user from './user.api.ts';
import categories from './categories.api.ts';
import seller from './seller.api.ts';
import product from './products.api.ts';
import order from './order.api.ts';
import paymentMethods from './paymentMethods.api.ts';
import chat from './chat.api.ts';

const api = {
  user,
  categories,
  seller,
  product,
  order,
  paymentMethods,
  chat
};

export default api;