const User = require("../models/userModel");
const Cart = require("../models/cartModel");

const addItem = async (req, res) => {
  try {
    const { userID, name, price, quantity, images, size } = req.body;

    if (!userID || !name || !price || !quantity) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newCart = new Cart({ name, price, quantity, images, size });
    await newCart.save();

    user.cart.push(newCart);
    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

const removeItem = async (req, res) => {
  try {
    const { userId, cartID } = req.body; // Assume userId and cartID are passed in the request body

    // Find the user and ensure the cart item exists in their cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Check if the cartID exists in the user's cart array
    const cartIndex = user.cart.indexOf(cartID);
    if (cartIndex === -1) {
      return res.status(400).send({
        message: "Cart item not found in user's cart",
        success: false,
      });
    }

    // Remove the cartID from the user's cart array
    user.cart.splice(cartIndex, 1);
    await user.save();

    // Optionally delete the cart item from the Cart collection
    await Cart.findByIdAndDelete(cartID);

    return res.status(200).send({
      message: "Cart item deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const updateQuantity = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;

    // Validate request body
    if (!userId) {
      return res.status(400).send({
        message: "Missing userID",
        success: false,
      });
    }
    if (!itemId) {
      return res.status(400).send({
        message: "Missing itemID",
        success: false,
      });
    }
    if (quantity == null || quantity < 1) {
      return res.status(400).send({
        message: "Quantity must be a positive integer",
        success: false,
      });
    }

    // Find the user
    const user = await User.findById(userId).populate("cart");
    if (!user) {
      return res.status(404).send({
        message: "User not found",
        success: false,
      });
    }

    // Find the cart item in the user's cart
    const cartItem = user.cart.find((item) => item._id.toString() === itemId);
    if (!cartItem) {
      return res.status(404).send({
        message: "Cart item not found",
        success: false,
      });
    }

    // Update the quantity
    cartItem.quantity = quantity;
    await cartItem.save();
    console.log(cartItem)

    return res.status(200).send({
      message: "Quantity updated successfully",
      success: true,
      data: cartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { addItem, removeItem, updateQuantity };
