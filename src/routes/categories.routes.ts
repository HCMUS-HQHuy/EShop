import express from 'express';

import * as controller from '../controllers/categories.controller';

const categories = express.Router();

categories.get('/', (req, res) => {
  res.send('List of categories');
});

categories.post('/add', controller.addCategory);

export default categories;
