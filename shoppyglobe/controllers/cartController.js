const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Add a product to the cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Validate product existence
    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found!" });

    // Check stock availability
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock!" });
    }

    // Find user's cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // Create a new cart if not found
      cart = await Cart.create({
        userId: req.user.id,
        products: [{ productId, quantity }],
      });
    } else {
      // Check if product already exists in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        // Update quantity if product exists in the cart
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add product to the cart
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the quantity of a product in the cart
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found!" });

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      // Update quantity
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }

    res.status(404).json({ message: "Product not found in the cart!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from the cart
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found!" });

    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
