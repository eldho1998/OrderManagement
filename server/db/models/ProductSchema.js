const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },

    description: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true,
    }
},
    { timestamps: true },
);

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;