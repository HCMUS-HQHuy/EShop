import express from 'express';

import * as controller from '../controllers/index.controller';
const product = express.Router();

product.get('/list', controller.listProducts);
// product.get('/:id', controller.getProductById);
product.post('/add', controller.addProduct);
// product.put('/:id', controller.updateProduct);
// product.delete('/:id', controller.deleteProduct);

export default product;