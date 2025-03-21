const Order = require('../db/models/OrderSchema');
const Product = require('../db/models/ProductSchema');
const mongoose = require('mongoose');

module.exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const formattedItems = items
      .filter(item => item.productId)
      .map(item => ({
        productId: new mongoose.Types.ObjectId(item.productId),
        quantity: item.quantity,
      }));

    if (formattedItems.length === 0) {
      return res.status(400).json({ error: "Order must have at least one valid item." });
    }


    const newOrder = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: formattedItems,
      status: 'Pending',
    });

    await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder,
    });

  } catch (e) {
    console.error('Order creation error:', e.message);
    res.status(400).json({ error: e.message });
  }
};

module.exports.getAllOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const order = await Order.find({ userId }).populate(
      {
        path: "items.productId",
        select: "name image price",
      }
    )
      .lean();

    if (!order.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user",
      });
    }

    res.status(200).json({
      message: 'Successfully fetched all orders',
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Shipped', 'Delivered'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order status updated successfully', order });
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.orderId,
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
