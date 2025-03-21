const express = require('express');
const router = express.Router();
const controller = require('../controllers/OrderControllers');

router.post('/create', controller.createOrder);
router.get('/:userId', controller.getAllOrdersByUserId);
router.put('/:id/status', controller.updateOrderStatus);
router.delete('/:orderId', controller.deleteOrder);

module.exports = router;
