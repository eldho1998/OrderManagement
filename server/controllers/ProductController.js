const Product = require('../db/models/ProductSchema');

module.exports.bootstrapProducts = async (req, res) => {
    try {
        const products = [
            {
                name: "Laptop",
                price: 1200,
                description: "High-performance laptop for gaming and work.",
                image: "pngwing.com.png"
            },
            {
                name: "Wireless Headphones",
                price: 150,
                description: "Noise-canceling headphones with deep bass.",
                image: "headphn.png"
            },
            {
                name: "Smartphone",
                price: 800,
                description: "Latest smartphone with an advanced camera.",
                image: "iphn.png"
            },
            {
                name: "Smartwatch",
                price: 250,
                description: "Track your fitness and receive notifications.",
                image: "smartwatch.png"
            }
        ];
        await Product.deleteMany({});

        const insertedProducts = await Product.insertMany(products);

        res.status(201).json({ message: "Products bootstrapped successfully!", products: insertedProducts });
    } catch (e) {
        res.status(500).json({ error: "Failed to bootstrap products", details: e.message });
    }
};

module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch products", details: e.message });
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (e) {
        res.status(500).json({ error: "Failed to fetch product", details: e.message });
    }
};

module.exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product updated successfully", updatedProduct });
    } catch (e) {
        res.status(500).json({ error: "Failed to update product", details: e.message });
    }
};

module.exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (e) {
        res.status(500).json({ error: "Failed to delete product", details: e.message });
    }
};