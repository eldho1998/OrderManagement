const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      ref: 'User',
      required: true,
    },
    orderId: {
      type: String,
      unique: true,
      default: () => `ORD-${Date.now()}`,
    },
    items: [
      {
        productId: {
          type: String,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: { type: Number, required: false },
    status: {
      type: String,
      enum: ['Pending', 'Shipped', 'Delivered'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
