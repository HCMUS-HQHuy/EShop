import user from './user.api.ts';
import categories from './categories.api.ts';
import seller from './seller.api.ts';
import product from './products.api.ts';
import paymentMethods from './paymentMethods.api.ts';
import chat from './chat.api.ts';

const api = {
  user,
  categories,
  seller,
  product,
  paymentMethods,
  chat
};

export default api;