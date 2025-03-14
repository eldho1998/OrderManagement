const Order = require('../db/models/OrderSchema');
const Product = require('../db/models/ProductSchema');

module.exports.createOrder = async (req, res) => {
    try {
        const { items } = req.body;
        let totalPrice = 0;

        const orderItems = await Promise.all(
            items.map(async (item) => {
                const product = await Product.findById(item.productId);
                if (!product) throw new Error(`Product not found: ${item.productId}`);

                totalPrice += product.price * item.quantity;
                return { productId: item.productId, quantity: item.quantity, price: product.price };
            })
        );
        const newOrder = new Order({ userId, items: orderItems, totalPrice });
        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully', order: newOrder });

    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

module.exports.getAllOrder = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('items.productId', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOne({ _id: req.params.orderId, userId: req.user.id });

        if (!order) return res.status(404).json({ error: 'Order not found' });

        order.status = status;
        await order.save();
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