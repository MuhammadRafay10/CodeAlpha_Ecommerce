const express = require('express');
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const router = express.Router();

router.route('/').get(getProducts).post(createProduct);
router.route('/:id').get(getProductById);

module.exports = router;