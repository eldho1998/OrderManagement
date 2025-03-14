const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderControllers');

router.post('/create', controller.createOrder);
router.get('/lists', controller.getAllOrder);
router.put('/:id/status', controller.updateOrderStatus);
router.delete('/:id', controller.deleteOrder);

module.exports = router;
