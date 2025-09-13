const User = require("../models/userModel");
const Order = require("../models/orderModel");

// Controller to add an order to a specific user
const addOrderToUser = async (req, res) => {
  const { userId, items, totalPrice } = req.body; // Accept an array of items and totalPrice

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate that `items` is an array
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Items array is required and should not be empty" });
    }

    
    // Create orders for each item in the items array
    const orderPromises = items.map((item) => {
      const newOrder = new Order({
        name: item.name,
        price: totalPrice,
        quantity: item.quantity || 1, // Default to 1 if quantity is not provided
        images: item.images || [], // Default to an empty array if images are not provided
        size: item.size,
      });
      return newOrder.save(); // Save the order to the database
    });

    // Wait for all orders to be saved
    const savedOrders = await Promise.all(orderPromises);

    // Add all orders to the user's orders array
    savedOrders.forEach((order) => {
      user.orders.push({
        order: order._id,
        totalPrice : order.price, // Assign the totalPrice for each order if applicable
      });
    });

    // Save the updated user to the database
    await user.save();

    res.status(201).json({
      message: "Orders added successfully",
      orders: savedOrders,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  addOrderToUser,
};
