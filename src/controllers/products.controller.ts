import express from 'express';

import * as service from '../services/products.services';

export const listProducts = (req: express.Request, res: express.Response) => {
    const products = service.listProducts();
    res.send(products);
};
