const Order = require('../db/models/OrderSchema');
const Product = require('../db/models/ProductSchema');
const mongoose = require("mongoose");

module.exports.createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ error: "Invalid request data" });
        }

        let totalPrice = 0;

        const orderItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Product not found: ${item.productId}`);

                totalPrice += product.price * item.quantity;
                return { productId: item.productId, quantity: item.quantity, price: product.price };
            })
        );
        const newOrder = new Order({ userId, items: orderItems, totalPrice, status: "Shipped" });
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });

    } catch (e) {
        console.error("Order creation error:", e.message);
        res.status(400).json({ error: e.message });
    }
};

module.exports.getAllOrder = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const orders = await Order.find({ userId });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;


        if (!["Pending", "Shipped", "Delivered"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ error: "Order not found" });

        res.json({ message: "Order status updated successfully", order });
        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ _id: req.params.orderId, userId: req.user.id });
        if (!order) return res.status(404).json({ error: 'Order not found' });

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};