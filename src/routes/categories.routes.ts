import express from 'express';

const categories = express.Router();

categories.get('/', (req, res) => {
  res.send('List of categories');
});

categories.post('/', (req, res) => {
  res.send('Category created');
});

export default categories;
