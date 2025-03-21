const Product = require('../db/models/ProductSchema');

module.exports.bootstrapProducts = async (req, res) => {
  try {
    const products = [
      {
        name: 'Laptop',
        price: 1200,
        description: 'High-performance laptop for gaming and work.',
        image: 'pngwing.com.png',
      },
      {
        name: 'Wireless Headphones',
        price: 150,
        description: 'Noise-canceling headphones with deep bass.',
        image: 'headphn.png',
      },
      {
        name: 'Smartphone',
        price: 800,
        description: 'Latest smartphone with an advanced camera.',
        image: 'iphn.png',
      },
      {
        name: 'Smartwatch',
        price: 250,
        description: 'Track your fitness and receive notifications.',
        image: 'smartwatch.png',
      },
      {
        name: 'Tablet',
        price: 600,
        description: 'A powerful tablet for entertainment and work.',
        image: 'tab.png',
      },
      {
        name: 'Gaming Console',
        price: 500,
        description: 'Next-gen gaming console for immersive gaming.',
        image: 'Gamingconsole.png',
      },
      {
        name: 'Bluetooth Speaker',
        price: 100,
        description: 'Portable speaker with deep bass and high-quality sound.',
        image: 'speaker.png',
      },
      {
        name: '4K Smart TV',
        price: 1500,
        description: 'Ultra HD TV with smart features for streaming.',
        image: 'smarttv.png',
      },
      {
        name: 'Mechanical Keyboard',
        price: 120,
        description:
          'High-quality mechanical keyboard for gaming and productivity.',
        image: 'keyboard.png',
      },
      {
        name: 'Drone',
        price: 1000,
        description: 'High-quality drone with camera for aerial photography.',
        image: 'drone.png',
      },
      {
        name: 'VR Headset',
        price: 400,
        description:
          'Virtual reality headset for immersive gaming and experiences.',
        image: 'vrheadset.png',
      },
      {
        name: 'Electric Scooter',
        price: 700,
        description: 'Eco-friendly scooter for convenient city commuting.',
        image: 'scooter.png',
      },
      {
        name: 'Smart Home Assistant',
        price: 200,
        description: 'AI-powered voice assistant for smart home control.',
        image: 'homeassistant.png',
      },
      {
        name: 'Portable Power Bank',
        price: 50,
        description: 'High-capacity power bank for charging devices on the go.',
        image: 'powerbank.png',
      },
    ];

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        { $set: product },
        { upsert: true }
      );
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const paginatedProducts = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();

    res.status(201).json({
      message: 'Products bootstrapped successfully!',
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products: paginatedProducts,
    });
  } catch (e) {
    res
      .status(500)
      .json({ error: 'Failed to bootstrap products', details: e.message });
  }
};

module.exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (e) {
    res
      .status(500)
      .json({ error: 'Failed to fetch products', details: e.message });
  }
};

module.exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (e) {
    res
      .status(500)
      .json({ error: 'Failed to fetch product', details: e.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ message: 'Product not found' });
    res
      .status(200)
      .json({ message: 'Product updated successfully', updatedProduct });
  } catch (e) {
    res
      .status(500)
      .json({ error: 'Failed to update product', details: e.message });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ message: 'Product not found' });
    res
      .status(200)
      .json({ message: 'Product deleted successfully', deletedProduct });
  } catch (e) {
    res
      .status(500)
      .json({ error: 'Failed to delete product', details: e.message });
  }
};
