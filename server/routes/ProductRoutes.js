const express = require('express');
const router = express.Router();
const controller = require('../controllers/ProductController');

router.get('/create', controller.bootstrapProducts);
router.get('/', controller.getAllProducts);
router.get('/:id', controller.getProductById);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);

module.exports = router;
