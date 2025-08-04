import express from 'express';

import * as controller from '../controllers/index.controller';
const product = express.Router();

product.get('/', controller.listProducts);

export default product;